import { useEffect, useRef, useState } from "react";

import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "../services/documents";

import api from "../services/api";
import { getToken } from "../services/auth";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDocuments();

      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Please login again.");
      } else {
        setError("Unable to load documents.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedExtensions = [
      ".pdf",
      ".txt",
      ".docx",
      ".md",
      ".pptx",
      ".xlsx",
    ];

    const extension =
      "." + file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError(
        "Unsupported file type. Allowed: PDF, TXT, DOCX, MD, PPTX, XLSX."
      );

      setSelectedFile(null);
      return;
    }

    setError("");
    setSuccess("");
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      await uploadDocument(selectedFile);

      setSuccess(
        `${selectedFile.name} uploaded successfully.`
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadDocuments();
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Please login again.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Document upload failed.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, filename) => {
    const confirmed = window.confirm(
      `Delete "${filename}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteDocument(id);

      setDocuments((current) =>
        current.filter((document) => document.id !== id)
      );

      setSuccess("Document deleted successfully.");
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Please login again.");
      } else {
        setError("Unable to delete document.");
      }
    }
  };

  const handleDownload = async (document) => {
    try {
      setError("");

      const response = await api.get(
        `/documents/download/${document.id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = window.document.createElement("a");

      link.href = url;
      link.download = document.filename;

      window.document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Please login again.");
      } else {
        setError("Unable to download document.");
      }
    }
  };

  const getFileType = (filename = "") => {
    const parts = filename.split(".");

    if (parts.length < 2) {
      return "FILE";
    }

    return parts.pop().toUpperCase();
  };

  const getFileIcon = (filename = "") => {
    const type = getFileType(filename);

    if (type === "PDF") {
      return "PDF";
    }

    if (type === "DOCX" || type === "DOC") {
      return "DOC";
    }

    if (type === "PPTX" || type === "PPT") {
      return "PPT";
    }

    if (type === "XLSX" || type === "XLS") {
      return "XLS";
    }

    if (type === "TXT" || type === "MD") {
      return "TXT";
    }

    return "FILE";
  };

  const filteredDocuments = documents.filter((document) =>
    document.filename
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
                  AI
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                  Knowledge Workspace
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Documents
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Upload and manage your knowledge documents.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right sm:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Documents
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {documents.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10">
        {/* Messages */}
        {error && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            <span>{success}</span>

            <button
              onClick={() => setSuccess("")}
              className="text-emerald-500 hover:text-emerald-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Upload Card */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 16V4" />
                      <path d="m7 9 5-5 5 5" />
                      <path d="M5 20h14" />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Upload Document
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Add files to your knowledge workspace.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "PDF",
                    "TXT",
                    "DOCX",
                    "MD",
                    "PPTX",
                    "XLSX",
                  ].map((type) => (
                    <span
                      key={type}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.docx,.md,.pptx,.xlsx"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-3 file:cursor-pointer file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 sm:w-auto"
                />

                <button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {uploading ? "Uploading..." : "Upload Document"}
                </button>
              </div>
            </div>

            {selectedFile && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-xs font-bold text-indigo-600 shadow-sm">
                  {getFileIcon(selectedFile.name)}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                    Selected file
                  </p>

                  <p className="truncate text-sm font-semibold text-slate-800">
                    {selectedFile.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Documents Card */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Documents Header */}
          <div className="border-b border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-950">
                    Your Documents
                  </h2>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                    {documents.length}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Manage the files in your knowledge base.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-80">
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  type="text"
                  placeholder="Search documents..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-10">
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse items-center gap-4"
                  >
                    <div className="h-12 w-12 rounded-xl bg-slate-100" />

                    <div className="flex-1">
                      <div className="h-4 w-2/3 rounded bg-slate-100" />
                      <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
                    </div>

                    <div className="h-10 w-24 rounded-xl bg-slate-100" />
                    <div className="h-10 w-20 rounded-xl bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredDocuments.length === 0 && (
            <div className="px-6 py-16 text-center sm:px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="text-slate-400"
                >
                  <path d="M6 3h9l4 4v14H6z" />
                  <path d="M14 3v5h5" />
                  <path d="M9 13h6" />
                  <path d="M9 17h6" />
                </svg>
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-800">
                {search
                  ? "No documents found"
                  : "No documents uploaded yet"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Try a different search term."
                  : "Upload your first document to start building your knowledge base."}
              </p>
            </div>
          )}

          {/* Documents List */}
          {!loading &&
            filteredDocuments.length > 0 && (
              <div>
                {filteredDocuments.map((document, index) => (
                  <div
                    key={document.id}
                    className={`group flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:px-8 ${
                      index !== filteredDocuments.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >
                    {/* File Icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-black text-indigo-600">
                      {getFileIcon(document.filename)}
                    </div>

                    {/* File Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                        {document.filename}
                      </h3>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                          {getFileType(document.filename)}
                        </span>

                        <span className="text-xs text-slate-400">
                          Knowledge document
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() =>
                          handleDownload(document)
                        }
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 3v12" />
                          <path d="m7 10 5 5 5-5" />
                          <path d="M5 21h14" />
                        </svg>

                        <span>Download</span>
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            document.id,
                            document.filename
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50"
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M4 7h16" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M6 7l1 14h10l1-14" />
                          <path d="M9 7V4h6v3" />
                        </svg>

                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </section>

        {/* Bottom Info */}
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Supported formats: PDF, TXT, DOCX, Markdown,
            PowerPoint and Excel
          </span>

          <span className="font-semibold text-slate-400">
            AI Knowledge Agent
          </span>
        </div>
      </main>
    </div>
  );
}

export default Documents;