"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaComments, FaSyncAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useT } from "@/app/i18n/useT";
import { formatHumanDateSmart } from "@/app/lib/datetime";
import NotificationDropdown from "@/app/components/NotificationDropdown";
import StudioProfileDropdown from "@/app/components/StudioProfileDropdown";
import {
  fetchStudioInbox,
  fetchStudioThread,
  postStudioChatMessage,
  type StudioChatMessageDto,
  type StudioInboxThreadRow,
} from "@/app/lib/studio-chat-client";

export default function StudioMessagesPage() {
  const t = useT();
  const [studioId, setStudioId] = useState<number | null>(null);
  const [threads, setThreads] = useState<StudioInboxThreadRow[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<StudioChatMessageDto[]>([]);
  const [artistId, setArtistId] = useState<number | null>(null);
  const [reply, setReply] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem("studio_id") : null;
    const n = raw != null ? Number(raw) : NaN;
    setStudioId(Number.isFinite(n) && n > 0 ? Math.floor(n) : null);
  }, []);

  const loadInbox = useCallback(async () => {
    if (studioId == null) return;
    setError(null);
    try {
      const data = await fetchStudioInbox(studioId);
      setThreads(data.threads);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadingList(false);
    }
  }, [studioId]);

  useEffect(() => {
    if (studioId == null) return;
    void loadInbox();
  }, [studioId, loadInbox]);

  useEffect(() => {
    if (studioId == null) return;
    const id = window.setInterval(() => void loadInbox(), 12000);
    return () => window.clearInterval(id);
  }, [studioId, loadInbox]);

  const loadThread = useCallback(
    async (threadId: number) => {
      if (studioId == null) return;
      setLoadingThread(true);
      setError(null);
      try {
        const data = await fetchStudioThread(studioId, threadId);
        setMessages(data.messages);
        setArtistId(data.thread.artistId);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoadingThread(false);
      }
    },
    [studioId],
  );

  const refreshAll = useCallback(async () => {
    if (studioId == null) return;
    setRefreshing(true);
    try {
      await loadInbox();
      if (selectedId != null) await loadThread(selectedId);
    } finally {
      setRefreshing(false);
    }
  }, [studioId, selectedId, loadInbox, loadThread]);

  useEffect(() => {
    if (selectedId == null || studioId == null) {
      setMessages([]);
      setArtistId(null);
      return;
    }
    void loadThread(selectedId);
  }, [selectedId, studioId, loadThread]);

  useEffect(() => {
    if (studioId == null || selectedId == null) return;
    const id = window.setInterval(() => void loadThread(selectedId), 8000);
    return () => window.clearInterval(id);
  }, [studioId, selectedId, loadThread]);

  const sendReply = async () => {
    const text = reply.trim();
    if (!text || studioId == null || selectedId == null || sending) return;
    setSending(true);
    setError(null);
    try {
      const data = await postStudioChatMessage(studioId, selectedId, text);
      setMessages(data.messages);
      setReply("");
      void loadInbox();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  };

  const studioProfile = useMemo(
    () => ({
      name: t("studioMessages.profileMenuName"),
      avatar: "/studio/avatar.png" as string | null,
    }),
    [t],
  );

  if (studioId == null) {
    return (
      <div className="min-h-screen text-white px-4 py-10 max-w-3xl mx-auto">
        <p className="text-gray-400">{t("studioMessages.missingStudioId")}</p>
        <Link
          href="/pages/studio/dashboard"
          className="inline-flex items-center gap-2 mt-4 text-purple-400 hover:text-purple-300"
        >
          <FaArrowLeft /> {t("studioMessages.backDashboard")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-gray-800 bg-gray-900/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/pages/studio/dashboard"
              className="lux-btn-ghost p-2 rounded-lg shrink-0"
              aria-label={t("studioMessages.backDashboard")}
            >
              <FaArrowLeft className="text-lg" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl font-bold font-special truncate flex items-center gap-2">
                <FaComments className="text-purple-400 shrink-0" />
                {t("studioMessages.title")}
              </h1>
              <p className="text-gray-400 text-sm truncate">
                {t("studioMessages.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void refreshAll()}
              disabled={refreshing || loadingList || loadingThread || sending}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-transparent px-3 py-2 text-xs text-gray-200 hover:bg-white/5 disabled:opacity-50"
              aria-label="Refresh messages"
            >
              <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <NotificationDropdown />
            <StudioProfileDropdown studioProfile={studioProfile} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[calc(100vh-220px)]">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 flex flex-col rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-700 font-semibold text-white/90">
              {t("studioMessages.inboxTitle")}
            </div>
            <div className="overflow-y-auto flex-1 max-h-[70vh] lg:max-h-none">
              {loadingList ? (
                <p className="p-4 text-gray-500 text-sm">
                  {t("studioChat.loading")}
                </p>
              ) : threads.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm">
                  {t("studioMessages.emptyInbox")}
                </p>
              ) : (
                <ul className="divide-y divide-gray-800">
                  {threads.map((row) => (
                    <li key={row.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(row.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-800/60 transition-colors ${
                          selectedId === row.id ? "bg-purple-900/25 border-l-2 border-l-purple-500" : ""
                        }`}
                      >
                        <div className="flex justify-between gap-2 text-xs text-gray-500 mb-1 font-mono">
                          <span>
                            {t("studioMessages.colThreadId")} #{row.id}
                          </span>
                          <span>
                            {t("studioMessages.colArtistId")} {row.artistId}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 line-clamp-2">
                          {row.preview || "—"}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {formatHumanDateSmart(row.updatedAt)} ·{" "}
                          {row.messageCount} {t("studioMessages.msgCount")}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-3 flex flex-col rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur-lg overflow-hidden min-h-[360px]"
          >
            {selectedId == null ? (
              <div className="flex-1 flex items-center justify-center p-8 text-gray-500 text-center text-sm">
                {t("studioMessages.selectThread")}
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-gray-700 flex flex-wrap gap-3 text-sm">
                  <span className="text-gray-400">
                    {t("studioMessages.colThreadId")}:{" "}
                    <span className="text-white font-mono">{selectedId}</span>
                  </span>
                  {artistId != null && (
                    <span className="text-gray-400">
                      {t("studioMessages.colArtistId")}:{" "}
                      <span className="text-white font-mono">{artistId}</span>
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[45vh] lg:max-h-[50vh]">
                  {loadingThread ? (
                    <p className="text-gray-500 text-sm">
                      {t("studioMessages.loadingThread")}
                    </p>
                  ) : (
                    messages.map((m) => {
                      const fromStudio = m.sender === "studio";
                      return (
                        <div
                          key={m.id}
                          className={`flex ${fromStudio ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={
                              fromStudio
                                ? "max-w-[90%] rounded-2xl rounded-br-md bg-purple-700/40 border border-purple-500/25 px-3 py-2"
                                : "max-w-[90%] rounded-2xl rounded-bl-md bg-gray-900/80 border border-gray-600/40 px-3 py-2"
                            }
                          >
                            <p className="text-[10px] uppercase text-white/45 mb-0.5">
                              {fromStudio
                                ? t("studioChat.studioLabel")
                                : t("studioMessages.artistLabel")}
                            </p>
                            <p className="text-sm text-gray-100 whitespace-pre-wrap">
                              {m.body}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-1">
                              #{m.id} · {formatHumanDateSmart(m.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="p-4 border-t border-gray-700 flex flex-col sm:flex-row gap-2">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={2}
                    className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder={t("studioMessages.replyPlaceholder")}
                    disabled={sending}
                  />
                  <button
                    type="button"
                    onClick={() => void sendReply()}
                    disabled={sending || !reply.trim()}
                    className="lux-btn-metal px-5 py-2 self-end sm:self-stretch h-fit shrink-0 disabled:opacity-50"
                  >
                    {sending ? t("studioChat.sending") : t("studioMessages.sendReply")}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
