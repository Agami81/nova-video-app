/* eslint-disable @typescript-eslint/no-explicit-any */
// v4 cache bust
import { fal } from '@fal-ai/client';
import { GenerationRequest, GenerationResponse } from './ai';

import { getPromptForStyle } from './styles';

// Configure Fal
fal.config({
    credentials: process.env.FAL_KEY || '',
});

export async function generateFalContentV2(request: GenerationRequest): Promise<GenerationResponse> {
    console.log("[Debug] Executing generateFalContentV2 (Renamed & Robust)");
    const isImg2Img = !!request.image_url;

    // Resolve the prompt using the style ID if provided
    let basePrompt = request.prompt;
    if (request.style) {
        // If the request.prompt is generic (e.g. constructed in frontend), we might want to override or append
        // But the frontend currently sends "A photo of a person in ${packId} style..."
        // Let's purely rely on our new rich prompts for the "style" part.
        const richStylePrompt = getPromptForStyle(request.style);
        basePrompt = richStylePrompt;
    }

    const prompt = basePrompt;

    try {
        if (!process.env.FAL_KEY) {
            console.warn("FAL_KEY is missing, returning mock response");
            await new Promise(r => setTimeout(r, 2000));
            return {
                url: request.type === 'image'
                    ? 'https://fal.media/files/monkey/A_cute_monkey_in_a_space_suit.jpeg'
                    : 'https://fal.media/files/zebra/A_zebra_running_in_the_savannah.mp4'
            };
        }

        if (request.type === 'image') {
            // STEP 1: Generate with PuLID (Instant Identity)
            // This replaces the old 2-step process (Generate -> Swap) with a single, higher-quality step
            // that generates the image *around* the face.
            // Prepare reference images from the new array or fallback to single
            const referenceImages = request.image_urls
                ? request.image_urls.map(url => ({ image_url: url }))
                : (request.image_url ? [{ image_url: request.image_url }] : []);

            console.log(`[Step 1] Generating with fal-ai/pulid (Instant Identity)...`);
            console.log(`[Debug] Request Body:`, JSON.stringify(request, null, 2));

            const pulidInput: any = {
                prompt: prompt,
                reference_images: referenceImages,
                num_inference_steps: 4, // Valid range: <= 12
                guidance_scale: 1.5, // Valid range: <= 1.5
                model_name: "flux-dev" // underlying model
            };

            console.log(`[Debug] PuLID Input:`, JSON.stringify(pulidInput, null, 2));

            const pulidResult: any = await fal.subscribe('fal-ai/pulid', {
                input: pulidInput,
                logs: true,
                onQueueUpdate: (update) => {
                    if (update.status === 'IN_PROGRESS') {
                        update.logs.map((log) => log.message).forEach(console.log);
                    }
                }
            });

            console.log("PuLID Result:", JSON.stringify(pulidResult, null, 2));

            const pulidData = pulidResult.data || pulidResult;
            const pulidUrl = pulidData.images?.[0]?.url || pulidData.url;

            if (!pulidUrl) {
                console.error("PuLID generation failed.");
                throw new Error("Failed to generate identity-preserved image. Please try a different photo.");
            }

            console.log(`[Step 1] PuLID Generation Complete: ${pulidUrl}`);
            return { url: pulidUrl };

        } else {
            // Use Minimax for Video (High Quality Text-to-Video)
            // ... (keep existing video logic)
            console.log("Submitting to fal-ai/minimax/video-01...");
            const videoInput: any = {
                prompt: prompt,
                image_url: request.image_url
            };

            // Use Minimax for Video (High Quality Text/Image-to-Video)
            // Tested and working.
            console.log("Submitting to fal-ai/minimax/video-01...");
            const result: any = await fal.subscribe('fal-ai/minimax/video-01', {
                input: videoInput,
                logs: true,
                onQueueUpdate: (update) => {
                    if (update.status === 'IN_PROGRESS') {
                        update.logs.map((log) => log.message).forEach(console.log);
                    }
                }
            });
            console.log("Fal Video Result:", JSON.stringify(result));

            const data = result.data || result;
            const url = data.video?.url || data.url;

            if (!url) {
                console.error("Missing URL in video result:", JSON.stringify(result));
                throw new Error("No video URL returned from Fal.ai");
            }
            return { url };
        }
    } catch (error: any) {
        console.error("Fal.ai Generation Error Details:", JSON.stringify(error, null, 2));

        let displayMessage = error.message || "Failed to generate content with Fal.ai";
        let detailedMessage = "";

        // Check for specific API error bodies
        if (error.body && error.body.detail) {
            if (Array.isArray(error.body.detail)) {
                try {
                    detailedMessage = error.body.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
                } catch (e) {
                    detailedMessage = JSON.stringify(error.body.detail);
                }
            } else {
                detailedMessage = error.body.detail;
            }
            displayMessage = detailedMessage; // Prefer detailed message for display if available
        }

        // Combine all potential error sources for keyword checking
        const combinedErrorString = (String(error.message || "") + " " + String(detailedMessage || "")).toLowerCase();

        console.log("[Debug] Combined Error String:", combinedErrorString);

        if (
            combinedErrorString.includes("no face detected") ||
            combinedErrorString.includes("no face detected") ||
            combinedErrorString.includes("align face fail") ||
            combinedErrorString.includes("could not detect face") ||
            combinedErrorString.includes("face swap failed")
        ) {
            displayMessage = "We couldn't detect a face in your photos. Please ensure your face is clearly visible and try again.";
        }

        return {
            url: '',
            error: displayMessage
        };
    }
}
