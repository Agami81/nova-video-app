import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '../../../lib/db';
import { generateContent, GenerationRequest } from '../../../lib/ai';

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body: GenerationRequest = await request.json();

        if (!body.prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Check user credits
        let user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            // Sync issue or webhook failed? Create user just in case (fallback)
            const clerkUser = await currentUser();
            const email = clerkUser?.emailAddresses[0]?.emailAddress;

            if (email) {
                user = await prisma.user.create({
                    data: {
                        clerkId: userId,
                        email: email,
                        credits: 3
                    }
                });
            } else {
                return NextResponse.json(
                    { error: 'User not found. Please log out and log in again.' },
                    { status: 404 }
                );
            }
        }

        if (user.credits <= 0) {
            return NextResponse.json(
                { error: 'Insufficient credits. Please upgrade.' },
                { status: 403 }
            );
        }

        const start = Date.now();
        console.log(`[API] Starting ${body.type} generation for prompt: "${body.prompt}"`);

        // Generate content
        const result = await generateContent(body);

        // Deduct credit
        await prisma.user.update({
            where: { clerkId: userId },
            data: { credits: { decrement: 1 } }
        });

        console.log(`[API] Generation completed in ${Date.now() - start}ms. Credits remaining: ${user.credits - 1}`);

        return NextResponse.json(result);
    } catch (error) {
        console.error('[API] Generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate content' },
            { status: 500 }
        );
    }
}
