export type StudioChatSender = "artist" | "studio";

export type StudioChatMessageDto = {
  id: number;
  sender: StudioChatSender;
  body: string;
  createdAt: string;
};

export type StudioChatThreadMeta = {
  id: number;
  studioId: number;
  artistId: number;
  preview: string;
  updatedAt: string;
};

export async function fetchArtistThread(
  studioId: number,
  artistId: number,
): Promise<{ thread: StudioChatThreadMeta | null; messages: StudioChatMessageDto[] }> {
  const q = new URLSearchParams({
    studioId: String(studioId),
    artistId: String(artistId),
  });
  const res = await fetch(`/api/studio-chat/thread?${q}`, { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err?.error === "string" ? err.error : "Failed to load messages",
    );
  }
  return res.json();
}

export async function postArtistChatMessage(
  studioId: number,
  artistId: number,
  body: string,
): Promise<{ thread: StudioChatThreadMeta; messages: StudioChatMessageDto[] }> {
  const res = await fetch("/api/studio-chat/thread", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studioId, artistId, body }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err?.error === "string" ? err.error : "Failed to send message",
    );
  }
  return res.json();
}

export type StudioInboxThreadRow = {
  id: number;
  artistId: number;
  preview: string;
  updatedAt: string;
  messageCount: number;
};

export async function fetchStudioInbox(
  studioId: number,
): Promise<{ threads: StudioInboxThreadRow[] }> {
  const res = await fetch(`/api/studio-chat/studio/${studioId}/threads`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err?.error === "string" ? err.error : "Failed to load inbox",
    );
  }
  return res.json();
}

export async function fetchStudioThread(
  studioId: number,
  threadId: number,
): Promise<{ thread: StudioChatThreadMeta; messages: StudioChatMessageDto[] }> {
  const res = await fetch(
    `/api/studio-chat/studio/${studioId}/threads/${threadId}`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err?.error === "string" ? err.error : "Failed to load thread",
    );
  }
  return res.json();
}

export async function postStudioChatMessage(
  studioId: number,
  threadId: number,
  body: string,
): Promise<{ messages: StudioChatMessageDto[] }> {
  const res = await fetch(
    `/api/studio-chat/studio/${studioId}/threads/${threadId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err?.error === "string" ? err.error : "Failed to send reply",
    );
  }
  return res.json();
}
