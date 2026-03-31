import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin/login"
  },
  providers: [
    CredentialsProvider({
      name: "Admin login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const email = credentials.email.toLowerCase();
        const admin = await prisma.adminUser.findUnique({ where: { email } });

        if (admin) {
          const valid = await compare(credentials.password, admin.passwordHash);
          if (!valid) {
            return null;
          }

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name ?? "Admin"
          };
        }

        const envEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        const envPassword = process.env.ADMIN_PASSWORD;

        if (!envEmail || !envPassword) {
          return null;
        }

        if (email === envEmail && credentials.password === envPassword) {
          return {
            id: "env-admin",
            email: envEmail,
            name: "Admin"
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};
