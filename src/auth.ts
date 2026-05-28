import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Provider } from "next-auth/providers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { findDevAccount } from "@/lib/auth/dev-users";
import { hasDatabase } from "@/lib/db";
import { AUTH_SECRET } from "@/lib/auth-secret";

const providers: Provider[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

providers.push(
  Credentials({
    id: "credentials",
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse(credentials);
      if (!parsed.success) return null;

      const { email, password } = parsed.data;

      // Dev accounts first (works even without database file)
      if (process.env.NODE_ENV !== "production") {
        const dev = findDevAccount(email, password);
        if (dev) {
          return {
            id: dev.id,
            email: dev.email,
            name: dev.name,
            image: null,
            role: dev.role,
          };
        }
      }

      if (hasDatabase()) {
        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user?.passwordHash) {
            const valid = await bcrypt.compare(password, user.passwordHash);
            if (valid) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role,
              };
            }
          }
        } catch (e) {
          console.warn("[auth] Database error:", e);
        }
      }

      return null;
    },
  }),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: hasDatabase() ? PrismaAdapter(prisma) : undefined,
  secret: AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/sign-in", newUser: "/dashboard" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
        if (hasDatabase()) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: user.id },
              select: { role: true },
            });
            if (dbUser?.role) token.role = dbUser.role;
          } catch {
            /* keep token role */
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
        session.user.role = (token.role as string) ?? "user";
      }
      return session;
    },
  },
});
