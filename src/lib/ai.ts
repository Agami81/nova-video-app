import OpenAI from 'openai';
import Replicate from 'replicate';

export type GenerationType = 'image' | 'video';

export interface GenerationRequest {
    prompt: string;
    type: GenerationType;
    style?: string;
}

export interface GenerationResponse {
    url: string;
    error?: string;
}

const MOCK_IMAGES = [
    'https://images.unsplash.com/photo-1679083216051-aa510a1a290f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', // Cyberpunk like
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', // Anime/Art like
    'https://images.unsplash.com/photo-1620641788247-98e41d713c54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', // Artistic
];

const MOCK_VIDEOS = [
    'https://cdn.coverr.co/videos/coverr-waves-crashing-on-the-beach-5559/1080p.mp4',
    'https://cdn.coverr.co/videos/coverr-cloudy-sky-2766/1080p.mp4',
];

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

const replicate = process.env.REPLICATE_API_TOKEN
    ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
    : null;

export async function generateContent(request: GenerationRequest): Promise<GenerationResponse> {
    if (request.type === 'image') {
        if (openai) {
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: request.prompt + (request.style ? `, ${request.style} style` : ''),
                n: 1,
                size: "1024x1024",
            });
            return { url: response.data?.[0]?.url || '' };
        } else {
            // Mock Fallback
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const randomImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
            return { url: randomImage };
        }
    } else {
        if (replicate) {
            const output = await replicate.run(
                "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb47ac814e58438ba3345a9edec5a28f625d89ac77",
                {
                    input: {
                        cond_aug: 0.02,
                        decoding_t: 7,
                        input_image: "https://replicate.delivery/pbxt/Jt7.../rocket.png", // SVD needs image input usually, simplifying for text-to-video models
                        // Switching to AnimateDiff for text-to-video better support
                        prompt: request.prompt,
                    }
                }
            );
            // For simplicity/reliability in this demo, using a text-to-video model:
            // Model: lucataco/animate-diff-lightning
            const videoOutput = await replicate.run(
                "lucataco/animate-diff-lightning:728956e107fc3572834b6e709292a831514742a77a9443cf2559530490b40ec4",
                {
                    input: {
                        prompt: request.prompt + (request.style ? `, ${request.style}` : ''),
                        n_prompt: "bad quality, distorted, watermark",
                        steps: 4,
                    }
                }
            );
            return { url: String(videoOutput) };

        } else {
            // Mock Fallback
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const randomVideo = MOCK_VIDEOS[Math.floor(Math.random() * MOCK_VIDEOS.length)];
            return { url: randomVideo };
        }
    }
}
