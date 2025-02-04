import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    console.log('request!!!!');
    const { id } = await params;
    try {
        const purchases = await prisma.purchase.findMany({
            where: {
                userId: id
            }
        })
        return NextResponse.json(purchases)
    } catch (err) {
        return NextResponse.json(err)
    }
}