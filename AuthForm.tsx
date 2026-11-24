"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import Lumi from "./Lumi";

type Mode = "login" | "signup" | "reset";
const COPY = {
  login: { title: "Tekrar hoş geldin", cta: "Giriş yap" },
  signup: { title: "Küçük evrenini kur", cta: "Hesap oluştur" },
  reset: { title: "Şifreni sıfırla", cta: "Sıfırlama bağlantısı gönder" }
};

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setInfo("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim(); const password = String(f.get("password") ?? "");
    if (mode !== "reset" && password.length < 8) return setError("Şifre en az 8 karakter olmalı.");
    setBusy(true);
    const sb = supabaseBrowser(); const site = process.env.NEXT_PUBLIC_SITE_URL ?? location.origin;
    if (mode === "login") {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) setError("E-posta veya şifre hatalı."); else { router.push("/dashboard"); router.refresh(); }
    } else if (mode === "signup") {
      const { data, error } = await sb.auth.signUp({ email, password, options: { data: { display_name: String(f.get("name")).trim() }, emailRedirectTo: `${site}/auth/callback` } });
      if (error) setError(error.message);
      else if (data.session) { router.push("/dashboard"); router.refresh(); }
      else setInfo("Hesabın oluşturuldu. E-postana gelen bağlantıyla doğrula, sonra giriş yap.");
    } else {
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${site}/auth/callback?next=/update-password` });
      if (error) setError(error.message); else setInfo("Bağlantı e-postana gönderildi. Gelen kutunu kontrol et.");
    }
    setBusy(false);
  }

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="card w-full max-w-md">
        <div className="mb-4 flex items-center gap-3"><Lumi expression={mode === "signup" ? "happy" : "normal"} size={72} />
          <div><p className="font-display text-3xl leading-none">Lunumi</p><p className="text-sm text-mute">Learn. Grow. Glow.</p></div></div>
        <h1 className="mb-4 text-2xl">{COPY[mode].title}</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "signup" && <input name="name" className="field" placeholder="Adın" required aria-label="Adın" />}
          <input name="email" type="email" className="field" placeholder="E-posta" required autoComplete="email" aria-label="E-posta" />
          {mode !== "reset" && <input name="password" type="password" className="field" placeholder="Şifre (en az 8 karakter)" required autoComplete={mode === "login" ? "current-password" : "new-password"} aria-label="Şifre" />}
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          {info && <p role="status" className="text-sm text-lavender-deep">{info}</p>}
          <button className="btn w-full" disabled={busy}>{busy ? "Bekle…" : COPY[mode].cta}</button>
        </form>
        <div className="mt-4 flex justify-between text-sm text-mute">
          {mode === "login" && <><Link href="/signup" className="underline">Hesap oluştur</Link><Link href="/reset" className="underline">Şifremi unuttum</Link></>}
          {mode !== "login" && <Link href="/login" className="underline">Girişe dön</Link>}
        </div>
      </div>
    </main>
  );
}
