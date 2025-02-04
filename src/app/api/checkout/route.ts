/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KET!)
export const POST = async (req: Request, res: Response) => {
    const baseUrl = 'http://localhost:3000'
    console.log('start');
    const { title, price, bookId, userId } = await req.json();
    console.log(title, price);
    try {
        // チェックアウトセッションの作成
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            metadata: {
                bookId: bookId,
            },
            client_reference_id: userId,
            line_items: [
                {
                    price_data: {
                        currency: "jpy",
                        product_data: {
                            name: title,
                        },
                        unit_amount: price,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${baseUrl}/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}`,
        });
        return NextResponse.json({
            checkout_url: session.url,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ message: err.message });
    }
}