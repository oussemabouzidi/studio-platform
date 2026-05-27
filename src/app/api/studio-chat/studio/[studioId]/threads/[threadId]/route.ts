import { NextRequest, NextResponse } from "next/server";
import {
  getThreadForStudio,
  postStudioMessage,
} from "@/lib/studio-chat-store";
import { studioChatErrorResponse } from "@/lib/studio-chat-http";

function parseId(v: string): number | null {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ studioId: string; threadId: string }> },
) {
  const { studioId: sRaw, threadId: tRaw } = await ctx.params;
  const studioId = parseId(sRaw);
  const threadId = parseId(tRaw);
  if (studioId == null || threadId == null) {
    return NextResponse.json({ error: "Invalid ids." }, { status: 400 });
  }

  try {
    const thread = await getThreadForStudio(studioId, threadId);
    if (!thread) {
      return NextResponse.json({ error: "Thread not found." }, { status: 404 });
    }

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

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ studioId: string; threadId: string }> },
) {
  const { studioId: sRaw, threadId: tRaw } = await ctx.params;
  const studioId = parseId(sRaw);
  const threadId = parseId(tRaw);
  if (studioId == null || threadId == null) {
    return NextResponse.json({ error: "Invalid ids." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = String((body as { body?: unknown })?.body ?? "").trim();
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
    const msg = await postStudioMessage(studioId, threadId, text);
    const thread = await getThreadForStudio(studioId, threadId);
    return NextResponse.json({
      message: msg,
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
  } catch (e) {
    if (e instanceof Error && e.message === "THREAD_NOT_FOUND") {
      return NextResponse.json({ error: "Thread not found." }, { status: 404 });
    }
    return studioChatErrorResponse(e);
  }
}
