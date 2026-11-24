-- LUNUMI schema. Every user table: user_id -> auth.users, RLS owner-only.
create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text, level text default 'B1' check (level in ('A2','B1','B2','C1')),
  goals text[] default '{}', interests text[] default '{}',
  avatar jsonb default '{}', lumi_customization jsonb default '{"expression":"normal","accessories":[]}',
  created_at timestamptz default now()
);
create table public.user_preferences (
  user_id uuid primary key references auth.users on delete cascade,
  dashboard_cards jsonb default '["welcome","motivation","daily_task","weekly_recs","quick_access","progress","exams","stats","recent"]',
  daily_goal_minutes int default 30, weekly_goal_minutes int default 210,
  tts_accent text default 'en-GB', updated_at timestamptz default now()
);
create table public.vocabulary (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  word text not null, meaning_tr text, word_type text, example text, example_tr text, notes text,
  cefr text, category text, is_favorite boolean default false, source text,
  -- spaced repetition (SM-2)
  ease numeric default 2.5, interval_days int default 0, repetitions int default 0, next_review date default current_date,
  created_at timestamptz default now(), unique (user_id, word)
);
create table public.grammar_progress (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  topic text not null, status text default 'not_started', notes text,
  attempts int default 0, correct int default 0, updated_at timestamptz default now(), unique (user_id, topic)
);
create table public.library_items (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  title text not null, kind text, exam text, topic text, level text, content text, file_path text,
  is_shared boolean default false, created_at timestamptz default now()
);
create table public.test_history (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  section text not null check (section in ('test','reading','listening','grammar','vocabulary')),
  exam text, total int not null, correct int not null, duration_seconds int default 0,
  topic_breakdown jsonb default '{}', created_at timestamptz default now()
);
create table public.wrong_answers (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  question_hash text not null, question text not null, options jsonb, user_answer text, correct_answer text,
  explanation text, topic text, exam text, notes text, source_id uuid references public.library_items on delete set null,
  attempts jsonb default '[]', created_at timestamptz default now(), updated_at timestamptz default now(),
  unique (user_id, question_hash)   -- repeat misses update attempts, no duplicates
);
create table public.study_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  section text not null, day date not null default current_date, seconds int not null default 0,
  updated_at timestamptz default now(), unique (user_id, section, day)  -- one row per section/day => no double counting
);
create table public.study_plans (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  title text not null, section text, due_date date not null default current_date,
  completed boolean default false, completed_at timestamptz, created_at timestamptz default now()
);
create table public.exam_countdowns (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  exam text not null check (exam in ('YDS','YOKDIL','IELTS')), exam_date date not null, target_score text,
  date_source text default 'manual', created_at timestamptz default now()
);
create table public.reading_activities (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  title text, level text, passage text, questions jsonb, score int, created_at timestamptz default now()
);
create table public.listening_activities (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  title text, level text, script text, audio_path text, questions jsonb, score int, created_at timestamptz default now()
);
create table public.writing_drafts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  task_type text, prompt text, body text default '', word_count int default 0, target_band numeric,
  evaluation jsonb, status text default 'draft', updated_at timestamptz default now(), created_at timestamptz default now()
);
create table public.speaking_activities (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  scenario text, level text, duration_seconds int default 0, transcript jsonb, created_at timestamptz default now()
);
create table public.achievements (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  badge_key text not null, progress int default 0, earned_at timestamptz, unique (user_id, badge_key)
);
create table public.lumi_messages (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  mode text default 'english', role text not null check (role in ('user','assistant')),
  content text not null, created_at timestamptz default now()
);
create table public.recommendations (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  week_start date not null, kind text, title text, description text, url text,
  is_favorite boolean default false, is_completed boolean default false, created_at timestamptz default now()
);
create table public.content_reports (
  id uuid primary key default gen_random_uuid(), reporter_id uuid not null references auth.users on delete cascade,
  item_id uuid not null references public.library_items on delete cascade, reason text, created_at timestamptz default now()
);

-- RLS: owner-only on every user table
do $$
declare t text;
begin
  foreach t in array array['vocabulary','grammar_progress','library_items','test_history','wrong_answers','study_sessions',
    'study_plans','exam_countdowns','reading_activities','listening_activities','writing_drafts','speaking_activities',
    'achievements','lumi_messages','recommendations'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "%1$s_owner" on public.%1$I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop;
end $$;

alter table public.profiles enable row level security;
create policy profiles_owner on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
alter table public.user_preferences enable row level security;
create policy prefs_owner on public.user_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
alter table public.content_reports enable row level security;
create policy reports_insert on public.content_reports for insert with check (auth.uid() = reporter_id);

-- Community library: others may READ only items the owner explicitly shared
create policy library_shared_read on public.library_items for select using (is_shared = true);

-- Auto-create profile + preferences on signup
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  insert into public.user_preferences (user_id) values (new.id);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Atomic study-time upsert (adds seconds; client sends only deltas)
create or replace function public.add_study_seconds(p_section text, p_seconds int) returns void
language sql security invoker as $$
  insert into public.study_sessions (user_id, section, day, seconds) values (auth.uid(), p_section, current_date, least(p_seconds, 120))
  on conflict (user_id, section, day) do update set seconds = study_sessions.seconds + least(p_seconds, 120), updated_at = now();
$$;
