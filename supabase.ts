import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** false ise uygulama çökmek yerine "yapılandırma eksik" ekranı gösterir. */
export const configured = Boolean(url && key);

export const supabase = createClient(url || "http://invalid.local", key || "missing", {
  // HashRouter (#/rota) ile uyum için PKCE: dönüş bağlantısında ?code= gelir, #token gelmez.
  auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true, autoRefreshToken: true }
});

/** https://kullanici.github.io/lunumi/ */
export const siteUrl = () => `${location.origin}${import.meta.env.BASE_URL}`;
