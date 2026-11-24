import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";
import Lumi from "../components/Lumi";
import DailyWord from "../components/DailyWord";
import { MOTIVATION, WORDS, dayIndex } from "../lib/content";

type Row = Record<string, any>;
type Data = { name: string; dGoal: number; wGoal: number; sessions: Row[]; vocab: number; tasks: Row[]; exams: Row[]; tests: Row[]; recent: Row[] };

const fmt = (s: number) => (s >= 3600 ? `${Math.floor(s / 3600)} sa ${Math.floor((s % 3600) / 60)} dk` : `${Math.floor(s / 60)} dk`);
const QUICK = [
  { to: "/vocabulary", t: "Kelimeler" }, { to: "/reading", t: "Reading Lab" }, { to: "/listening", t: "Listening Lab" },
  { to: "/writing", t: "Writing Lab" }, { to: "/plan", t: "Günlük Plan" }, { to: "/tests", t: "Test Merkezi" }
];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function Dashboard() {
  const { session } = useAuth();
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const today = iso(new Date()); const weekAgo = iso(new Date(Date.now() - 6 * 864e5));
    Promise.all([
      supabase.from("profiles").select("display_name").eq("id", session!.user.id).single(),
      supabase.from("user_preferences").select("daily_goal_minutes,weekly_goal_minutes").eq("user_id", session!.user.id).single(),
      supabase.from("study_sessions").select("day,seconds").gte("day", weekAgo),
      supabase.from("vocabulary").select("id", { count: "exact", head: true }),
      supabase.from("study_plans").select("id,title,completed").eq("due_date", today),
      supabase.from("exam_countdowns").select("exam,exam_date,target_score").gte("exam_date", today).order("exam_date").limit(3),
      supabase.from("test_history").select("total,correct"),
      supabase.from("test_history").select("section,correct,total").order("created_at", { ascending: false }).limit(5)
    ]).then(([p, pr, s, v, t, e, th, r]) => {
      const failed = [p, s, v, t, e, th, r].find((x) => x.error);
      if (failed?.error) { setErr(failed.error.message); return; }
      setData({ name: p.data?.display_name ?? "", dGoal: (pr.data?.daily_goal_minutes ?? 30) * 60, wGoal: (pr.data?.weekly_goal_minutes ?? 210) * 60,
        sessions: s.data ?? [], vocab: v.count ?? 0, tasks: t.data ?? [], exams: e.data ?? [], tests: th.data ?? [], recent: r.data ?? [] });
    });
  }, [session]);

  if (err) return <p role="alert" className="card mx-auto max-w-xl text-red-600">Veriler okunamadı: {err}. SQL şemasını Supabase'de çalıştırdın mı?</p>;
  if (!data) return <p className="text-center text-mute">Yükleniyor…</p>;

  const today = iso(new Date());
  const daily = data.sessions.filter((s) => s.day === today).reduce((a, s) => a + s.seconds, 0);
  const weekly = data.sessions.reduce((a, s) => a + s.seconds, 0);
  const totalQ = data.tests.reduce((a, t) => a + t.total, 0), totalC = data.tests.reduce((a, t) => a + t.correct, 0);
  const idx = dayIndex();
  const done = data.tasks.filter((t) => t.completed).length;
  const days = (d: string) => Math.ceil((new Date(d).getTime() - new Date(today).getTime()) / 864e5);
  const bars: [string, number, number][] = [["Bugün", daily, data.dGoal], ["Bu hafta", weekly, data.wGoal]];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="card flex flex-col items-center gap-4 bg-gradient-to-br from-lavender-soft to-rose-soft sm:flex-row">
        <Lumi expression={daily > 0 ? "studying" : "happy"} size={130} />
        <div><h1 className="text-3xl sm:text-4xl">Merhaba {data.name}!</h1><p className="mt-1 text-lg text-ink/80">{MOTIVATION[idx % MOTIVATION.length]}</p></div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card"><h2 className="mb-3 text-xl">Bugünün görevi</h2>
          {data.tasks.length === 0 ? <p className="empty">Bugün için görev yok. <Link to="/plan" className="font-semibold text-lavender-deep underline">Plan oluştur</Link></p>
            : <><p className="mb-2 text-sm text-mute">{done}/{data.tasks.length} tamamlandı</p>
                <ul className="space-y-2">{data.tasks.map((t) => <li key={t.id} className={`rounded-chip bg-lavender-soft/50 px-4 py-2 ${t.completed ? "line-through opacity-60" : ""}`}>{t.title}</li>)}</ul></>}
        </section>
        <section className="card"><h2 className="mb-3 text-xl">Günün kelimesi</h2><DailyWord w={WORDS[idx % WORDS.length]} /></section>
      </div>

      <section className="card"><h2 className="mb-3 text-xl">Haftalık öneriler</h2>
        <p className="empty">Henüz öneri yok. Seviyene ve zayıf yönlerine göre kişisel öneriler Faz 5'te burada görünecek.</p></section>

      <section><h2 className="mb-3 text-xl">Hızlı erişim</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {QUICK.map((q) => <Link key={q.to} to={q.to} className="card text-center font-display text-lg transition hover:shadow-lift">{q.t}</Link>)}
        </div></section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card"><h2 className="mb-3 text-xl">Çalışma süresi</h2>
          {bars.map(([l, v, g]) => (
            <div key={l} className="mb-3">
              <div className="mb-1 flex justify-between text-sm"><span>{l}</span><span className="text-mute">{fmt(v)} / {fmt(g)}</span></div>
              <div className="h-3 overflow-hidden rounded-full bg-lavender-soft" role="progressbar" aria-valuenow={Math.min(100, Math.round((v / g) * 100))} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-lavender-deep" style={{ width: `${Math.min(100, (v / g) * 100)}%` }} /></div>
            </div>))}
        </section>
        <section className="card"><h2 className="mb-3 text-xl">Sınav geri sayımı</h2>
          {data.exams.length === 0 ? <p className="empty">Sınav tarihi eklenmedi. Resmî tarihi kendin gir; tarih uydurmuyoruz.</p>
            : <ul className="space-y-2">{data.exams.map((e) => <li key={e.exam + e.exam_date} className="flex items-center justify-between rounded-chip bg-rose-soft px-4 py-2"><span className="font-semibold">{e.exam}{e.target_score ? ` · hedef ${e.target_score}` : ""}</span><span>{days(e.exam_date)} gün</span></li>)}</ul>}
        </section>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card"><h2 className="mb-3 text-xl">İstatistikler</h2>
          <dl className="grid grid-cols-3 gap-2 text-center">
            <div><dt className="text-sm text-mute">Kelime</dt><dd className="font-display text-3xl">{data.vocab}</dd></div>
            <div><dt className="text-sm text-mute">Soru</dt><dd className="font-display text-3xl">{totalQ}</dd></div>
            <div><dt className="text-sm text-mute">Başarı</dt><dd className="font-display text-3xl">{totalQ ? `%${Math.round((totalC / totalQ) * 100)}` : "–"}</dd></div>
          </dl>
          {totalQ === 0 && <p className="empty mt-3">Yeterli veri yok. İlk testini çözünce başarı oranın burada görünür.</p>}
        </section>
        <section className="card"><h2 className="mb-3 text-xl">Son aktiviteler</h2>
          {data.recent.length === 0 ? <p className="empty">Henüz aktivite yok.</p>
            : <ul className="space-y-2 text-sm">{data.recent.map((r, i) => <li key={i} className="flex justify-between rounded-chip bg-lavender-soft/50 px-4 py-2"><span className="capitalize">{r.section}</span><span>{r.correct}/{r.total}</span></li>)}</ul>}
        </section>
      </div>
    </div>
  );
}
