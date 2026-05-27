"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/app/i18n/useT";
import {
  fetchArtistThread,
  postArtistChatMessage,
  type StudioChatMessageDto,
  type StudioChatThreadMeta,
} from "@/app/lib/studio-chat-client";
import { formatHumanDateSmart } from "@/app/lib/datetime";
import { FaSyncAlt } from "react-icons/fa";

type StudioChatPanelProps = {
  studioId: number;
  studioName: string;
  artistId: number | null;
};

export default function StudioChatPanel({
  studioId,
  studioName,
  artistId,
}: StudioChatPanelProps) {
  const t = useT();
  const [thread, setThread] = useState<StudioChatThreadMeta | null>(null);
  const [messages, setMessages] = useState<StudioChatMessageDto[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (artistId == null) {
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const data = await fetchArtistThread(studioId, artistId);
      setThread(data.thread);
      setMessages(data.messages);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [studioId, artistId]);

  const refresh = async () => {
    if (artistId == null) return;
    setLoading(true);
    await load();
  };

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (artistId == null) return;
    const id = window.setInterval(() => {
      void load();
    }, 8000);
    return () => window.clearInterval(id);
  }, [artistId, load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = draft.trim();
    if (!text || artistId == null || sending) return;
    setSending(true);
    setError(null);
    try {
      const data = await postArtistChatMessage(studioId, artistId, text);
      setThread(data.thread);
      setMessages(data.messages);
      setDraft("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  };

  if (artistId == null) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/25 p-6 text-center text-gray-400">
        <p className="text-white/90 mb-1 font-medium">
          {t("studioChat.signInTitle")}
        </p>
        <p className="text-sm">{t("studioChat.signInBody")}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/25 p-8 text-center text-gray-400">
        {t("studioChat.loading")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-gray-400 text-sm">
          {t("studioChat.intro", { studio: studioName })}
        </p>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading || sending}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-transparent px-3 py-1.5 text-xs text-gray-200 hover:bg-white/5 disabled:opacity-50"
          aria-label="Refresh messages"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {thread && (
        <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1 border-b border-white/10 pb-3">
          <span>
            {t("studioMessages.colThreadId")}:{" "}
            <span className="text-purple-300 font-mono">{thread.id}</span>
          </span>
          <span>
            {t("studioMessages.colArtistId")}:{" "}
            <span className="text-purple-300 font-mono">{thread.artistId}</span>
          </span>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">
            {t("studioChat.emptyArtist")}
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.sender === "artist";
            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    mine
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-purple-700/50 border border-purple-500/30 px-4 py-2"
                      : "max-w-[85%] rounded-2xl rounded-bl-md bg-gray-800/80 border border-gray-600/50 px-4 py-2"
                  }
                >
                  <p className="text-[10px] uppercase tracking-wide text-white/50 mb-1">
                    {mine ? t("studioChat.youLabel") : t("studioChat.studioLabel")}
                  </p>
                  <p className="text-gray-100 whitespace-pre-wrap text-sm">
                    {m.body}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {formatHumanDateSmart(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="lux-input flex-1 min-h-[88px] resize-y text-sm"
          placeholder={t("studioChat.placeholder")}
          disabled={sending}
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={sending || !draft.trim()}
          className="lux-btn-metal px-5 py-2 h-fit self-end sm:self-stretch shrink-0 disabled:opacity-50"
        >
          {sending ? t("studioChat.sending") : t("studioChat.send")}
        </button>
      </div>
    </div>
  );
}
