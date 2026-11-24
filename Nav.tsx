"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard", label: "Ana Sayfa", ready: true },
  { href: "/vocabulary", label: "Kelimeler" }, { href: "/grammar", label: "Gramer" },
  { href: "/tests", label: "Test Merkezi" }, { href: "/wrong-answers", label: "Yanlışlar" },
  { href: "/reading", label: "Reading" }, { href: "/listening", label: "Listening" }, { href: "/writing", label: "Writing" },
  { href: "/plan", label: "Çalışma Planı" }, { href: "/stats", label: "İstatistikler" }, { href: "/badges", label: "Rozetler" }
];

export default function Nav({ name }: { name: string }) {
  const path = usePathname();
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-1 p-5 lg:flex">
        <Link href="/dashboard" className="mb-6 block"><span className="font-display text-3xl">Lunumi</span><span className="block text-xs text-mute">Learn. Grow. Glow.</span></Link>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Ana gezinme">
          {ITEMS.map((i) => (
            <Link key={i.href} href={i.href} aria-current={path === i.href ? "page" : undefined}
              className={`rounded-chip px-4 py-2.5 font-semibold ${path === i.href ? "bg-lavender-soft text-lavender-deep" : "text-mute hover:bg-lavender-soft/60"}`}>
              {i.label}{!i.ready && <span className="ml-2 text-[11px] font-normal opacity-60">yakında</span>}
            </Link>
          ))}
        </nav>
        <form action="/auth/signout" method="post" className="mt-3">
          <p className="mb-2 truncate px-1 text-sm text-mute">{name}</p>
          <button className="btn-ghost w-full">Çıkış yap</button>
        </form>
      </aside>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex gap-1 overflow-x-auto border-t border-lavender-soft bg-pearl/95 p-2 pr-24 lg:hidden" aria-label="Mobil gezinme">
        {ITEMS.map((i) => (
          <Link key={i.href} href={i.href} className={`shrink-0 rounded-chip px-3 py-2 text-sm font-semibold ${path === i.href ? "bg-lavender-soft text-lavender-deep" : "text-mute"}`}>{i.label}</Link>
        ))}
      </nav>
    </>
  );
}
