# Lunumi — Learn. Grow. Glow.

## Kurulum (Faz 1)
1. `npm install`
2. Supabase'de proje aç. SQL Editor'da `supabase/migrations/001_schema.sql` dosyasını çalıştır.
3. `.env.example` dosyasını `.env.local` olarak kopyala; Supabase URL ve anon key'i doldur.
4. Supabase > Authentication > URL Configuration: Site URL = `http://localhost:3000`, Redirect URL'lere `http://localhost:3000/auth/callback` ekle.
5. `npm run dev`

## Güvenlik
- Tüm kullanıcı tablolarında RLS açık (yalnızca sahibi okur/yazar). Topluluk kütüphanesinde yalnızca `is_shared = true` kayıtlar okunur.
- Gizli anahtarlar yalnızca sunucuda; `NEXT_PUBLIC_` önekli olanlar tarayıcıya açıktır (anon key RLS ile korunur).
- Çalışma süresi `add_study_seconds` RPC'si ile gün/bölüm başına tek satırda toplanır (çift sayım yok).

## Durum
Bkz. sohbetteki Faz 1 raporu.
