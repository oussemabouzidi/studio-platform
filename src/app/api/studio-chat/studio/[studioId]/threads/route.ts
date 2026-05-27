import { NextResponse } from "next/server";
import { listStudioThreads } from "@/lib/studio-chat-store";
import { studioChatErrorResponse } from "@/lib/studio-chat-http";

function parseId(v: string): number | null {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ studioId: string }> },
) {
  const { studioId: raw } = await ctx.params;
  const studioId = parseId(raw);
  if (studioId == null) {
    return NextResponse.json({ error: "Invalid studio id." }, { status: 400 });
  }

  try {
    const threads = await listStudioThreads(studioId);
    return NextResponse.json({ threads });
  } catch (err) {
    return studioChatErrorResponse(err);
  }
}
