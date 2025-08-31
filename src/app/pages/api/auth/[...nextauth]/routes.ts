import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // This runs after successful OAuth login
    async signIn({ user, account, profile }) {
        try {
            const res = await fetch(`http://localhost:8800/api/auth/oauth-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user.email,
                name: user.name,
                provider: account!.provider,
                providerId: profile!.id
            }),
            });

            const data = await res.json();
            return data.success; // true → sign in, false → reject
        } catch (err) {
            console.error("OAuth backend error:", err);
            return false;
        }
    },

    async session({ session, token, user }) {
      // optional: you can add extra info to session here
      return session
    }
  },
  pages: {
    signIn: '/login', // custom login page
  },
  session: { strategy: "jwt" },
})


