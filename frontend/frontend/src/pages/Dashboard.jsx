import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getDocuments } from "../services/document";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_documents: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDocuments();

      let documents = [];

      if (Array.isArray(data)) {
        documents = data;
      } else if (Array.isArray(data.documents)) {
        documents = data.documents;
      } else if (Array.isArray(data.items)) {
        documents = data.items;
      }

      setStats({
        total_documents: documents.length,
      });
    } catch (error) {
      console.error("Failed to load documents:", error);

      setStats({
        total_documents: 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="mx-auto flex max-w-[1600px] flex-col md:flex-row">
        <Sidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8 lg:p-10">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative max-w-3xl">
              <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                Knowledge Workspace
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Turn your documents into answers.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Upload your knowledge, search it with AI, and keep your
                important documents organized in one place.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/documents")}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Manage Documents
                </button>

                <button
                  onClick={() => navigate("/chat")}
                  className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Open AI Chat →
                </button>
              </div>
            </div>
          </section>

          {/* STATISTICS */}
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Uploaded Documents"
              value={stats.total_documents}
              icon="▣"
            />

            <StatCard
              label="AI Assistant"
              value="Ready"
              icon="✦"
            />

            <StatCard
              label="Knowledge Search"
              value="Online"
              icon="⌁"
            />
          </section>

          {/* QUICK START */}
          <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Quick Start
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Build your knowledge base
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Add PDF, TXT, DOCX, Markdown, PowerPoint, or Excel files,
                then ask questions from the uploaded content.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <StepCard
                  number="01"
                  title="Upload"
                  text="Add your source documents."
                />

                <StepCard
                  number="02"
                  title="Index"
                  text="Your content becomes searchable."
                />

                <StepCard
                  number="03"
                  title="Ask"
                  text="Get answers from your files."
                />
              </div>
            </div>

            {/* SHORTCUTS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Shortcuts
              </p>

              <div className="mt-5 space-y-3">
                <ActionButton
                  title="Upload a document"
                  subtitle="Add knowledge to your workspace"
                  onClick={() => navigate("/documents")}
                />

                <ActionButton
                  title="Ask the AI"
                  subtitle="Search your uploaded content"
                  onClick={() => navigate("/chat")}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* STAT CARD */

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">
          {label}
        </span>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* STEP CARD */

function StepCard({ number, title, text }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <span className="text-xs font-bold text-indigo-600">
        {number}
      </span>

      <h3 className="mt-2 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

/* ACTION BUTTON */

function ActionButton({ title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
    >
      <div>
        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      <span className="text-lg font-bold text-indigo-600">
        →
      </span>
    </button>
  );
}

export default Dashboard;