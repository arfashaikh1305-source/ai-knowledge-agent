import { useEffect, useState } from "react";
import {
  getDocuments,
  deleteDocument,
  uploadDocument,
  downloadDocument,
  generateSummary,
} from "../services/document";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      await uploadDocument(file);
      alert("Document uploaded successfully!");
      setFile(null);
      const input = document.getElementById("document-file");
      if (input) input.value = "";
      loadDocuments();
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);
      alert("Document deleted.");
      loadDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const blob = await downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed.");
    }
  };

  const handleSummary = async (id) => {
    try {
      const response = await generateSummary(id);
      alert(response.summary);
    } catch (err) {
      console.error(err);
      alert("Unable to generate summary.");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="mx-auto flex max-w-[1600px] flex-col md:flex-row">
        <Sidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Knowledge library</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Your documents</h1>
            <p className="mt-2 text-sm text-slate-500">Upload, review, summarize, download, or remove your knowledge sources.</p>
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold">Add a new document</h2>
                <p className="mt-1 text-sm text-slate-500">PDF, TXT, DOCX, MD, PPTX, and XLSX are supported.</p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label htmlFor="document-file" className="flex min-h-11 cursor-pointer items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50/50">
                  <span className="mr-2">＋</span>
                  {file ? file.name : "Choose file"}
                </label>
                <input id="document-file" type="file" accept=".pdf,.txt,.docx,.md,.pptx,.xlsx" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
                <button onClick={handleUpload} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-600">
                  Upload document
                </button>
              </div>
            </div>
          </section>

          <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-bold">Uploaded files</h2>
                <p className="mt-1 text-xs text-slate-500">{documents.length} document{documents.length === 1 ? "" : "s"} in your library</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{documents.length}</span>
            </div>

            {documents.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-xl text-slate-500">▣</div>
                <h3 className="mt-4 font-bold">No documents yet</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">Upload your first document above and it will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-bold">Document</th>
                      <th className="px-5 py-4 font-bold">Type</th>
                      <th className="px-5 py-4 font-bold">ID</th>
                      <th className="px-5 py-4 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="transition hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">▤</span>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-800">{doc.filename}</p>
                              <p className="mt-0.5 text-xs text-slate-400">Knowledge source</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">{doc.file_type || "—"}</td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-500">#{doc.id}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleDownload(doc.id, doc.filename)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100">Download</button>
                            <button onClick={() => handleSummary(doc.id)} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100">Summary</button>
                            <button onClick={() => handleDelete(doc.id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Documents;
