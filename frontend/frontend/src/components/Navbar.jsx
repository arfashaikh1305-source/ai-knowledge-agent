import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 text-left"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-lg font-bold text-white shadow-lg shadow-slate-950/10">
            AI
          </span>
          <span>
            <span className="block text-base font-bold tracking-tight text-slate-900 md:text-lg">
              AI Knowledge Agent
            </span>
            <span className="hidden text-xs text-slate-500 sm:block">
              Your documents, one intelligent workspace
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={logout}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
