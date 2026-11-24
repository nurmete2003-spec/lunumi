import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function UpdatePassword() {
  const nav = useNavigate(); const [msg, setMsg] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const pw = String(new FormData(e.currentTarget).get("password"));
    if (pw.length < 8) return setMsg("Şifre en az 8 karakter olmalı.");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) setMsg(error.message); else nav("/dashboard");
  }
  return (
    <form onSubmit={onSubmit} className="card mx-auto mt-10 max-w-md space-y-3">
      <h1 className="text-2xl">Yeni şifre belirle</h1>
      <input name="password" type="password" className="field" placeholder="Yeni şifre" required autoComplete="new-password" aria-label="Yeni şifre" />
      {msg && <p role="alert" className="text-sm text-red-600">{msg}</p>}
      <button className="btn w-full">Şifreyi kaydet</button>
    </form>
  );
}
