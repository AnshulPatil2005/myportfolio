"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiX, HiPaperAirplane } from "react-icons/hi";
import { BsChatDots } from "react-icons/bs";

type Message = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What are your strongest skills?",
  "Tell me about the GSoC project",
  "Are you open to internships?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;
      const userMsg: Message = { role: "user", content: text.trim() };
      const next = [...messages, userMsg];
      setMessages(next);
      setInput("");
      setStreaming(true);

      // Placeholder for assistant streaming reply
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok || !res.body) throw new Error("API error");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          // Update the last (assistant) message in-place
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "assistant", content: accumulated };
            return copy;
          });
        }
      } catch {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "Sorry, I couldn't connect right now. Please try again.",
          };
          return copy;
        });
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming]
  );

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Open AI chat assistant"
          className="relative w-12 h-12 rounded-full dark:bg-zinc-900 bg-white border dark:border-zinc-700 border-zinc-200 shadow-lg flex items-center justify-center dark:text-zinc-300 text-zinc-600 hover:dark:border-zinc-500 hover:border-zinc-300 hover:scale-105 active:scale-95 transition-all duration-150"
        >
          <span className="absolute inset-0 rounded-full hidden dark:block animate-ping dark:bg-primary-color/10 bg-transparent" />
          <span className="relative z-10">
            {open ? <HiX className="text-lg" /> : <BsChatDots className="text-lg" />}
          </span>
        </button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-xl border dark:border-zinc-700 border-zinc-200 dark:bg-zinc-900 bg-white shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: "min(520px, 70dvh)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-zinc-800 border-zinc-200 dark:bg-zinc-800/50 bg-zinc-50 shrink-0">
              <div className="w-7 h-7 rounded-full dark:bg-primary-color/20 bg-tertiary-color/10 flex items-center justify-center">
                <span className="text-xs">✦</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold font-incognito">Ask Anshul&apos;s AI</p>
                <p className="text-xs dark:text-zinc-500 text-zinc-400">Powered by Claude Haiku</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="dark:text-zinc-500 text-zinc-400 hover:dark:text-zinc-200 hover:text-zinc-700 transition-colors"
              >
                <HiX />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 [&::-webkit-scrollbar]:hidden">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-sm dark:text-zinc-400 text-zinc-500 text-center py-4">
                    Hi! Ask me anything about Anshul&apos;s work, skills, or projects.
                  </p>
                  <div className="flex flex-col gap-2">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-left text-xs dark:bg-zinc-800 bg-zinc-50 border dark:border-zinc-700 border-zinc-200 rounded-lg px-3 py-2 dark:text-zinc-300 text-zinc-600 dark:hover:border-zinc-500 hover:border-zinc-300 transition-colors duration-150"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] text-sm px-3 py-2 rounded-xl leading-relaxed ${
                        msg.role === "user"
                          ? "dark:bg-zinc-700 bg-zinc-200 dark:text-zinc-100 text-zinc-800 rounded-br-sm"
                          : "dark:bg-zinc-800 bg-zinc-50 border dark:border-zinc-700 border-zinc-200 dark:text-zinc-300 text-zinc-700 rounded-bl-sm"
                      }`}
                    >
                      {msg.content || (
                        <span className="inline-flex gap-1 items-center dark:text-zinc-500 text-zinc-400">
                          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                          <span className="animate-bounce" style={{ animationDelay: "120ms" }}>·</span>
                          <span className="animate-bounce" style={{ animationDelay: "240ms" }}>·</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2 px-3 py-3 border-t dark:border-zinc-800 border-zinc-200 shrink-0"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something…"
                disabled={streaming}
                className="flex-1 bg-transparent text-sm dark:text-white text-zinc-900 placeholder:dark:text-zinc-500 placeholder:text-zinc-400 outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                aria-label="Send message"
                className="dark:text-primary-color text-tertiary-color disabled:opacity-30 hover:opacity-80 transition-opacity"
              >
                <HiPaperAirplane className="rotate-90 text-lg" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
