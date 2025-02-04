/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server"
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KET!)

export const POST = async (req: Request, res: Response) => {
    const { sessionId } = await req.json();

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const existingPurchase = await prisma.purchase.findFirst(
            {
                where: {
                    userId: session.client_reference_id!,
                    bookId: session.metadata?.bookId!,
                }
            }
        )
        if (existingPurchase) return NextResponse.json({ message: 'すでに購入済みです' });
        const purchase = await prisma.purchase.create({
            data: {
                userId: session.client_reference_id!,
                bookId: session.metadata?.bookId!,
            }
        })
        return NextResponse.json({ purchase })
    } catch (err) {
        return NextResponse.json(err)
    }
}