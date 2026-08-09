import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { getToken } from "../services/auth";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/chat/history", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setHistory(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load chat history.");
    } finally {
      setLoading(false);
    }
  };

  const deleteHistory = async (id) => {
    const confirmed = window.confirm(
      "Delete this conversation from history?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/chat/history/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setHistory((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error(err);
      setError("Unable to delete this history item.");
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white">
              AI
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Knowledge Workspace
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                Chat History
              </h1>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            View the questions and answers from your previous AI conversations.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Back to Chat */}
        <div className="mb-6">
          <Link
            to="/chat"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            ← Back to AI Chat
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-50 p-5"
                >
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-full rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-4/5 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && history.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
              💬
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No chat history yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Ask your AI Knowledge Agent a question and your conversation
              will appear here.
            </p>

            <Link
              to="/chat"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Start an AI Chat
            </Link>
          </div>
        )}

        {/* History */}
        {!loading && history.length > 0 && (
          <div className="space-y-4">
            {history.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
                        Question
                      </span>

                      <span className="text-xs text-slate-400">
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <h2 className="mt-3 text-base font-bold leading-6 text-slate-900">
                      {item.question}
                    </h2>

                    <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        AI Answer
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {item.answer}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteHistory(item.id)}
                    className="shrink-0 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default History;