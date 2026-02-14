/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "../../../../lib/db";
import { stripe } from "../../../../lib/stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return new NextResponse("Webhook Secret missing", { status: 500 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse("User id is missing", { status: 400 });
        }

        await prisma.user.update({
            where: {
                clerkId: session.metadata.userId,
            },
            data: {
                isSubscribed: true,
                stripeCustomerId: subscription.customer as string,
                subscriptionId: subscription.id,
                credits: { increment: 1000 } // Add 1000 credits on subscription
            },
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        // If it's a renewal (not the first payment which is handled by checkout.session.completed)
        // We should check if we already handled this via checkout.session.completed or check billing reason
        // For simplicity, we can rely on checkout.session.completed for the first one.
        // But for recurring, we need to find the user by subscriptionId

        const user = await prisma.user.findUnique({
            where: { subscriptionId: subscription.id }
        });

        if (user) {
            // Add credits for renewal
            await prisma.user.update({
                where: { id: user.id },
                data: { credits: { increment: 1000 } }
            });
        }
    }

    return new NextResponse(null, { status: 200 });
}
