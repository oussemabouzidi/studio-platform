import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export function studioChatErrorResponse(err: unknown) {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error("[studio-chat]", err);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2021" || err.code === "P2022") {
      return NextResponse.json(
        {
          error:
            "Chat tables are missing. Run `npm run db:chat:bootstrap` (existing DB) or `npm run db:migrate` (fresh DB).",
        },
        { status: 503 },
      );
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      {
        error:
          "Database is not configured. Set DATABASE_URL and run `npx prisma migrate deploy`.",
      },
      { status: 503 },
    );
  }

  if (
    err instanceof Error &&
    /database|connect|ECONNREFUSED|DATABASE_URL/i.test(err.message)
  ) {
    return NextResponse.json(
      {
        error:
          "Could not reach the database. Check DATABASE_URL and that MySQL is running.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { error: "Unexpected server error while handling chat." },
    { status: 500 },
  );
}
