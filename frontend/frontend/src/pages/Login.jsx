import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, saveToken } from "../services/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);
      saveToken(data.access_token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-sm font-black text-slate-950">AI</span>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">AI Knowledge Agent</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">Your documents.<br />Your knowledge.<br />One smart workspace.</h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">Upload your files and use AI to explore information faster without changing the way your existing knowledge is stored.</p>
          </div>
          <p className="text-xs text-slate-500">Secure workspace · Document intelligence</p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">AI</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Welcome back</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Sign in to your workspace</h2>
          <p className="mt-2 text-sm text-slate-500">Continue where you left off.</p>

          {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" required />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Logging in..." : "Sign in"}</button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">Don't have an account? <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
