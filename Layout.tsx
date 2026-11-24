import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";
import Nav from "./Nav";
import LumiFab from "./LumiFab";

export default function Layout({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [name, setName] = useState("");
  useEffect(() => {
    supabase.from("profiles").select("display_name").eq("id", session!.user.id).single()
      .then(({ data }) => setName(data?.display_name ?? session!.user.email ?? ""));
  }, [session]);
  return (
    <div className="flex min-h-screen">
      <Nav name={name} />
      <main className="min-w-0 flex-1 px-4 pb-28 pt-6 lg:px-10 lg:pb-10">
        {children}
        <p className="mt-10 text-center text-xs text-mute" data-testid="build-stamp">Lunumi v3 · build {__BUILD_SHA__} · {__BUILD_TIME__.slice(0, 16).replace("T", " ")} UTC</p>
      </main>
      <LumiFab />
    </div>
  );
}
