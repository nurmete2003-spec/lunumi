import { NavLink } from "react-router-dom";
import { supabase } from "../lib/supabase";

export const NAV = [
  { to: "/dashboard", label: "Ana Sayfa", ready: true },
  { to: "/vocabulary", label: "Kelimeler" }, { to: "/grammar", label: "Gramer" },
  { to: "/tests", label: "Test Merkezi" }, { to: "/wrong-answers", label: "Yanlışlar" },
  { to: "/reading", label: "Reading" }, { to: "/listening", label: "Listening" }, { to: "/writing", label: "Writing" },
  { to: "/plan", label: "Çalışma Planı" }, { to: "/stats", label: "İstatistikler" }, { to: "/badges", label: "Rozetler" }
] as { to: string; label: string; ready?: boolean }[];

const cls = (active: boolean, mobile = false) =>
  `${mobile ? "shrink-0 px-3 py-2 text-sm" : "px-4 py-2.5"} rounded-chip font-semibold ${active ? "bg-lavender-soft text-lavender-deep" : "text-mute hover:bg-lavender-soft/60"}`;

export default function Nav({ name }: { name: string }) {
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-1 p-5 lg:flex">
        <div className="mb-6"><span className="font-display text-3xl">Lunumi</span><span className="block text-xs text-mute">Learn. Grow. Glow.</span></div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Ana gezinme">
          {NAV.map((i) => (
            <NavLink key={i.to} to={i.to} className={({ isActive }) => cls(isActive)}>
              {i.label}{!i.ready && <span className="ml-2 text-[11px] font-normal opacity-60">yakında</span>}
            </NavLink>))}
        </nav>
        <p className="mb-2 mt-3 truncate px-1 text-sm text-mute">{name}</p>
        <button className="btn-ghost w-full" onClick={() => supabase.auth.signOut()}>Çıkış yap</button>
      </aside>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex gap-1 overflow-x-auto border-t border-lavender-soft bg-pearl/95 p-2 pr-24 lg:hidden" aria-label="Mobil gezinme">
        {NAV.map((i) => <NavLink key={i.to} to={i.to} className={({ isActive }) => cls(isActive, true)}>{i.label}</NavLink>)}
        <button className="shrink-0 px-3 py-2 text-sm font-semibold text-mute" onClick={() => supabase.auth.signOut()}>Çıkış</button>
      </nav>
    </>
  );
}
