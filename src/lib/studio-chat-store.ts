import type { StudioChatMessage as PrismaMessage, StudioChatThread as PrismaThread } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ChatSender = "artist" | "studio";

export interface ChatMessage {
  id: number;
  sender: ChatSender;
  body: string;
  createdAt: string;
}

export interface ChatThread {
  id: number;
  studioId: number;
  artistId: number;
  preview: string;
  updatedAt: string;
  messages: ChatMessage[];
}

function previewFromBody(body: string, max = 160): string {
  const t = body.trim().replace(/\s+/g, " ");
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

function mapMessage(m: PrismaMessage): ChatMessage {
  const sender: ChatSender = m.sender === "studio" ? "studio" : "artist";
  return {
    id: m.id,
    sender,
    body: m.body,
    createdAt: m.createdAt.toISOString(),
  };
}

function mapThread(
  row: PrismaThread & { messages: PrismaMessage[] },
): ChatThread {
  return {
    id: row.id,
    studioId: row.studioId,
    artistId: row.artistId,
    preview: row.preview ?? "",
    updatedAt: row.updatedAt.toISOString(),
    messages: row.messages.map(mapMessage),
  };
}

export async function getThreadForArtist(
  studioId: number,
  artistId: number,
): Promise<ChatThread | null> {
  const row = await prisma.studioChatThread.findUnique({
    where: {
      studioId_artistId: { studioId, artistId },
    },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  return row ? mapThread(row) : null;
}

export async function postArtistMessage(
  studioId: number,
  artistId: number,
  body: string,
): Promise<ChatThread> {
  return prisma.$transaction(async (tx) => {
    const preview = previewFromBody(body);
    const thread = await tx.studioChatThread.upsert({
      where: {
        studioId_artistId: { studioId, artistId },
      },
      create: {
        studioId,
        artistId,
        preview,
      },
      update: {
        preview,
      },
    });

    await tx.studioChatMessage.create({
      data: {
        threadId: thread.id,
        sender: "artist",
        body,
      },
    });

    const full = await tx.studioChatThread.findUniqueOrThrow({
      where: { id: thread.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    return mapThread(full);
  });
}

export type StudioInboxRow = {
  id: number;
  artistId: number;
  preview: string;
  updatedAt: string;
  messageCount: number;
};

export async function listStudioThreads(
  studioId: number,
): Promise<StudioInboxRow[]> {
  const rows = await prisma.studioChatThread.findMany({
    where: {
      studioId,
      messages: { some: {} },
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      artistId: true,
      preview: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    artistId: r.artistId,
    preview: r.preview ?? "",
    updatedAt: r.updatedAt.toISOString(),
    messageCount: r._count.messages,
  }));
}

export async function getThreadForStudio(
  studioId: number,
  threadId: number,
): Promise<ChatThread | null> {
  const row = await prisma.studioChatThread.findFirst({
    where: { id: threadId, studioId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  return row ? mapThread(row) : null;
}

export async function postStudioMessage(
  studioId: number,
  threadId: number,
  body: string,
): Promise<ChatMessage> {
  return prisma.$transaction(async (tx) => {
    const thread = await tx.studioChatThread.findFirst({
      where: { id: threadId, studioId },
    });
    if (!thread) {
      throw new Error("THREAD_NOT_FOUND");
    }

    const msg = await tx.studioChatMessage.create({
      data: {
        threadId,
        sender: "studio",
        body,
      },
    });

    await tx.studioChatThread.update({
      where: { id: threadId },
      data: { preview: previewFromBody(body) },
    });

    return mapMessage(msg);
  });
}
