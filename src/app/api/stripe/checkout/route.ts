import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { stripe } from '../../../../lib/stripe';
import { prisma } from '../../../../lib/db';

const settingsUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const priceId = process.env.STRIPE_PRICE_ID;

        if (!priceId) {
            return NextResponse.json({ error: "Stripe Price ID missing" }, { status: 500 });
        }

        let dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!dbUser) {
            dbUser = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: user.emailAddresses[0].emailAddress,
                    credits: 3
                }
            });
        }

        // Create checkout session
        const validationUrl = settingsUrl + '/profile';

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: validationUrl,
            cancel_url: validationUrl,
            payment_method_types: ['card'],
            mode: 'subscription',
            billing_address_collection: 'auto',
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: userId,
            },
        });

        return NextResponse.json({ url: stripeSession.url });

    } catch (error) {
        console.log("[STRIPE_ERROR]", error);
        return NextResponse.json({ error: "Internal Error", details: String(error) }, { status: 500 });
    }
}
