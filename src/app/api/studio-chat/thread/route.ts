import { NextRequest, NextResponse } from "next/server";
import {
  getThreadForArtist,
  postArtistMessage,
} from "@/lib/studio-chat-store";
import { studioChatErrorResponse } from "@/lib/studio-chat-http";

function parseId(v: string | null): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}

export async function GET(req: NextRequest) {
  const studioId = parseId(req.nextUrl.searchParams.get("studioId"));
  const artistId = parseId(req.nextUrl.searchParams.get("artistId"));
  if (studioId == null || artistId == null) {
    return NextResponse.json(
      { error: "studioId and artistId query params are required." },
      { status: 400 },
    );
  }

  try {
    const thread = await getThreadForArtist(studioId, artistId);
    return NextResponse.json({
      thread: thread
        ? {
            id: thread.id,
            studioId: thread.studioId,
            artistId: thread.artistId,
            preview: thread.preview,
            updatedAt: thread.updatedAt,
          }
        : null,
      messages: thread?.messages ?? [],
    });
  } catch (err) {
    return studioChatErrorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const studioId = parseId(
    String((body as { studioId?: unknown })?.studioId ?? ""),
  );
  const artistId = parseId(
    String((body as { artistId?: unknown })?.artistId ?? ""),
  );
  const text = String((body as { body?: unknown })?.body ?? "").trim();

  if (studioId == null || artistId == null) {
    return NextResponse.json(
      { error: "studioId and artistId are required." },
      { status: 400 },
    );
  }
  if (!text.length) {
    return NextResponse.json({ error: "Message body is required." }, { status: 400 });
  }
  if (text.length > 8000) {
    return NextResponse.json(
      { error: "Message is too long (max 8000 characters)." },
      { status: 400 },
    );
  }

  try {
    const thread = await postArtistMessage(studioId, artistId, text);
    return NextResponse.json({
      thread: {
        id: thread.id,
        studioId: thread.studioId,
        artistId: thread.artistId,
        preview: thread.preview,
        updatedAt: thread.updatedAt,
      },
      messages: thread.messages,
    });
  } catch (err) {
    return studioChatErrorResponse(err);
  }
}
