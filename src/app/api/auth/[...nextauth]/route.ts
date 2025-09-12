import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

export const runtime = "nodejs";

const providerList = [] as any[];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providerList.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providerList.push(
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  );
}

export const { handlers } = NextAuth({
  debug: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/pages/auth/login" },
  providers: providerList,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const res = await fetch(`http://localhost:8800/api/auth/connect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: (user as any)?.email,
            name: (user as any)?.name,
            image: (user as any)?.image,
            provider: account?.provider,
            providerId: (profile as any)?.id ?? account?.providerAccountId,
          }),
        });

        const data = await res.json().catch(() => ({ success: false }));
        return !!data?.success;
      } catch (err) {
        console.error("OAuth connect error:", err);
        return false;
      }
    },
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;


