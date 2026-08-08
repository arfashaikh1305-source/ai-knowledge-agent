import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!question.trim() || loading) return;

    const userMessage = { sender: "user", text: question.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await api.post("/chat/", {
        question: userMessage.text,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.data.answer },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Unable to get AI response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (error) {
      console.error(error);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="mx-auto flex max-w-[1600px] flex-col md:flex-row">
        <Sidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">AI assistant</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Ask your knowledge base</h1>
              <p className="mt-2 text-sm text-slate-500">Answers are generated from your uploaded documents.</p>
            </div>
            <button
              onClick={clearChat}
              disabled={!messages.length}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear chat
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white">✦</span>
                <div>
                  <p className="text-sm font-bold">Knowledge Assistant</p>
                  <p className="text-xs text-slate-500">Ready to answer</p>
                </div>
              </div>
              <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online
              </span>
            </div>

            <div className="h-[55vh] min-h-[420px] overflow-y-auto bg-slate-50/70 p-4 sm:p-6">
              {messages.length === 0 && (
                <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-950 text-2xl text-white shadow-xl shadow-slate-900/10">✦</div>
                  <h2 className="mt-5 text-xl font-bold">What would you like to know?</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Ask a question about any information contained in your uploaded documents.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {["Summarize this document", "What are the key points?", "Find important details"].map((item) => (
                      <button key={item} onClick={() => setQuestion(item)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mx-auto max-w-4xl space-y-5">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "ai" && <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-sm text-white">✦</span>}
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-2xl ${msg.sender === "user" ? "rounded-br-md bg-slate-950 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700"}`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {msg.sender === "ai" && (
                        <button onClick={() => copyMessage(msg.text)} className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800">
                          Copy response
                        </button>
                      )}
                    </div>
                    {msg.sender === "user" && <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">You</span>}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-sm text-white">✦</span>
                    <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                      <span className="inline-flex items-center gap-1">
                        Thinking<span className="animate-pulse">...</span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-inner focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/10">
                <textarea
                  rows="1"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask something about your uploaded documents..."
                  className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!question.trim() || loading}
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-slate-400">Press Enter to send · Shift + Enter for a new line</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Chat;
