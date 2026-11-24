"use client";
import { useState } from "react";
import Lumi from "./Lumi";

/** Phase 1: UI shell only. The /api/lumi route and message persistence arrive in Phase 4. */
export default function LumiFab() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && (
        <section aria-label="Lumi chat" className="fixed bottom-24 right-4 z-40 flex h-[min(70vh,520px)] w-[min(92vw,380px)] flex-col rounded-card bg-pearl shadow-lift">
          <header className="flex items-center gap-3 border-b border-lavender-soft p-4">
            <Lumi expression="happy" size={44} />
            <div className="flex-1"><p className="font-display text-lg leading-none">Lumi</p><p className="text-xs text-mute">İngilizce öğretmenin</p></div>
            <button onClick={() => setOpen(false)} className="btn-ghost" aria-label="Sohbeti kapat">Kapat</button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            <p className="empty">Lumi sohbeti henüz bağlı değil. AI anahtarı ve sohbet API'si Faz 4'te eklenecek.</p>
          </div>
          <form className="flex gap-2 border-t border-lavender-soft p-3" onSubmit={(e) => e.preventDefault()}>
            <input className="field" placeholder="Lumi'ye sor…" disabled aria-label="Mesaj" />
            <button className="btn" disabled>Gönder</button>
          </form>
        </section>
      )}
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Lumi'yi aç"
        className="fixed bottom-4 right-4 z-40 grid h-16 w-16 place-items-center rounded-full bg-lavender-soft shadow-lift transition hover:scale-105">
        <Lumi expression="normal" size={48} />
      </button>
    </>
  );
}
