import NextAuth from "next-auth";

export const runtime = "nodejs";

const { handlers } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [],
});

export const GET = handlers.GET;
export const POST = handlers.POST;
