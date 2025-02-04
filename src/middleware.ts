
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    // /profile ページへのリクエストがあった場合
    if (req.nextUrl.pathname === "/profile")
        console.log('middleware!!!!', req.cookies);
    // セッションが存在しない場合（未認証）
    if (!req.cookies.get("next-auth.session-token")) {
        // リダイレクトURLを指定
        const callbackUrl = encodeURIComponent(req.nextUrl.pathname); // 認証後にリダイレクトするURL
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?callbackUrl=${callbackUrl}`);
    }


    // 認証されていればそのまま進む
    return NextResponse.next();
}

export const config = {
    matcher: ["/profile"], // /profile ページのみ対象
};
