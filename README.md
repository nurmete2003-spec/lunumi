# Lunumi — Learn. Grow. Glow.  (v3, Vite + React + TypeScript)

## Yayın nasıl çalışır
`main`'e push → GitHub Actions `npm ci` + `npm run build` → `dist/` klasörü GitHub Pages'e yüklenir.
**Pages kaynağı "GitHub Actions" olmalı** (Settings → Pages → Build and deployment → Source). "Deploy from a branch" kalırsa
site depo kökündeki eski dosyaları/README'yi gösterir; eski v2 dosyaları artık sitenin önüne geçemez çünkü yalnızca `dist/` yayınlanır.

## Bir kerelik kurulum
1. Supabase SQL Editor: `supabase/migrations/001_schema.sql` çalıştır.
2. Supabase → Authentication → URL Configuration: Site URL = `https://KULLANICI.github.io/lunumi/`, Redirect URLs'e aynı adresi (sonda `/` ile) ekle.
3. GitHub → Settings → Secrets and variables → Actions → New repository secret: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
4. GitHub → Settings → Pages → Source: **GitHub Actions**.
5. Depo adın `lunumi` değilse `vite.config.ts` içindeki `BASE` değerini `/depo-adi/` yap.

## Yerelde
`npm install && npm run dev`

## Yayında doğrulama
Giriş sonrası sayfanın altında "Lunumi v3 · build <commit>" yazar; bu kodun GitHub'daki son commit'in ilk 7 hanesiyle eşleşmesi gerekir.
