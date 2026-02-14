import { Hono } from 'hono'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '../../lib/db'
import { generateFalContentV2 } from '../../lib/fal'
import { GenerationRequest } from '../../lib/ai'

const app = new Hono()

app.post('/generate', async (c) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return c.json({ error: 'Unauthorized' }, 401);
        }

        const body = await c.req.json<GenerationRequest>();

        if (!body.prompt) {
            return c.json({ error: 'Prompt is required' }, 400);
        }

        // Check user credits
        let user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        // Auto-create user if missing
        if (!user) {
            const clerkUser = await currentUser();
            const email = clerkUser?.emailAddresses[0]?.emailAddress;

            if (email) {
                user = await prisma.user.create({
                    data: {
                        clerkId: userId,
                        email: email,
                        credits: 50 // Start with 50 free credits for testing
                    }
                });
            }
        }

        if (user && user.credits <= 0) {
            return c.json({ error: 'Insufficient credits. Please upgrade.' }, 403);
        }

        // Deduct credit
        if (user) {
            await prisma.user.update({
                where: { clerkId: userId },
                data: { credits: { decrement: 1 } }
            });
        }

        console.log(`[Hono] Starting Fal.ai generation: ${body.type}`);

        // Generate with Fal.ai
        const result = await generateFalContentV2(body);

        if (result.error) {
            return c.json(result, 500);
        }



        return c.json(result);

    } catch (error: any) {
        console.error('[Hono] Error:', error);
        return c.json({ error: error.message || String(error) }, 500);
    }
})

export default app
