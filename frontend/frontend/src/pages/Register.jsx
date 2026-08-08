import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await registerUser(username, email, password);
      setMessage("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl lg:grid lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-sm font-black text-slate-950">AI</span>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Get started</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">Create your intelligent knowledge workspace.</h1>
            <div className="mt-8 space-y-4">
              {[["01", "Upload", "Bring your documents together."], ["02", "Search", "Find information with AI."], ["03", "Learn", "Turn files into useful answers."]].map(([n, title, text]) => (
                <div key={n} className="flex gap-3">
                  <span className="text-xs font-bold text-indigo-300">{n}</span>
                  <div><p className="text-sm font-bold">{title}</p><p className="text-xs text-slate-400">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500">AI Knowledge Agent</p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8 lg:hidden"><span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">AI</span></div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Create account</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Join your workspace</h2>
          <p className="mt-2 text-sm text-slate-500">Set up your account in a few seconds.</p>

          {message && <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{message}</div>}
          {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}

          <form onSubmit={handleRegister} className="mt-7 space-y-4">
            <Field label="Username" type="text" placeholder="Choose a username" value={username} onChange={setUsername} />
            <Field label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
            <Field label="Password" type="password" placeholder="Create a password" value={password} onChange={setPassword} />
            <button type="submit" disabled={loading} className="mt-2 w-full rounded-xl bg-slate-950 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Creating account..." : "Create account"}</button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, placeholder, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" required />
    </div>
  );
}

export default Register;
