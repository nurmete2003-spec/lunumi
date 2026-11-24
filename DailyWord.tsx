import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { DailyWord as W } from "../lib/content";

export default function DailyWord({ w }: { w: W }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const canSpeak = "speechSynthesis" in window;
  function speak() { const u = new SpeechSynthesisUtterance(w.word); u.lang = "en-GB"; speechSynthesis.cancel(); speechSynthesis.speak(u); }
  async function add() {
    setState("saving");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setState("error");
    const { error } = await supabase.from("vocabulary").upsert(
      { user_id: user.id, word: w.word, meaning_tr: w.meaning_tr, word_type: w.type, example: w.example, example_tr: w.example_tr, cefr: w.cefr, source: "daily_word" },
      { onConflict: "user_id,word", ignoreDuplicates: true });
    setState(error ? "error" : "saved");
  }
  return (
    <div>
      <div className="flex items-baseline gap-3"><h3 className="text-3xl">{w.word}</h3><span className="text-sm text-mute">{w.type} · {w.cefr}</span></div>
      <p className="mt-1">{w.meaning_en}</p><p className="text-lavender-deep">{w.meaning_tr}</p>
      <p className="mt-3 italic">“{w.example}”</p><p className="text-sm text-mute">{w.example_tr}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn-ghost" onClick={speak} disabled={!canSpeak}>Dinle</button>
        <button className="btn" onClick={add} disabled={state === "saving" || state === "saved"}>
          {state === "saved" ? "Defterine eklendi" : state === "saving" ? "Ekleniyor…" : "Kelime defterine ekle"}</button>
      </div>
      {state === "error" && <p role="alert" className="mt-2 text-sm text-red-600">Eklenemedi. SQL şeması Supabase'de kurulu mu?</p>}
    </div>
  );
}
