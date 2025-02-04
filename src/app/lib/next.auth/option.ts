import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from 'next-auth/providers/github'
import prisma from "../prisma";
export const nextAuthOptions: NextAuthOptions = {
    debug: false,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!

        }),
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("Sign-in response", user, account, profile);
            if (account?.provider === 'github' && profile?.email) {
                console.log('成功');
                return true; // サインインが成功した場合にtrueを返す
            }
            return false; // 認証失敗の場合
        },
        session: ({ session, user }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id
                }
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET
    , pages: {
        signIn: '/login'
    }
}   