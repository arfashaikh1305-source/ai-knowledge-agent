import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: "⌂",
  },
  {
    to: "/documents",
    label: "Documents",
    icon: "▣",
  },
  {
    to: "/chat",
    label: "AI Chat",
    icon: "✦",
  },
  {
    to: "/history",
    label: "History",
    icon: "◷",
  },
];

function Sidebar() {
  return (
    <aside className="w-full shrink-0 bg-slate-950 text-white md:min-h-screen md:w-64">
      <div className="p-5">
        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-black text-slate-950">
              AI
            </div>

            <div>
              <p className="text-sm font-bold">
                Workspace
              </p>

              <p className="text-xs text-slate-400">
                Knowledge Center
              </p>
            </div>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto md:block md:space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `group flex min-w-max items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition md:w-full ${
                  isActive
                    ? "bg-white text-slate-950 shadow-lg shadow-black/10"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-lg text-sm ${
                      isActive
                        ? "bg-slate-100"
                        : "bg-white/10"
                    }`}
                  >
                    {link.icon}
                  </span>

                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 md:block">
          <div className="mb-2 text-lg">
            ✦
          </div>

          <p className="text-sm font-semibold">
            Ask your documents
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Upload a file and use AI Chat to find answers
            from your knowledge base.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;