# SCS Explorer

A web app for exploring SendCutSend's materials, hardware, and finishes catalog.

![SvelteKit](https://img.shields.io/badge/SvelteKit-5-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-blue)
![Supabase](https://img.shields.io/badge/Supabase-auth%20%2B%20db-green)

## Features

- **Materials Browser** - Browse 146 materials with filters for group, category, and thickness
- **Hardware Catalog** - Explore 151 hardware items with 3D models and tech drawings
- **Finish Options** - View 24 finish options with color swatches
- **User Auth** - Sign in with email or Google to save favorites
- **Responsive** - Works on desktop and mobile

## Quick Start

### 1. Install dependencies

```bash
bun install
```

### 2. Set up environment variables

Copy the example env file:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials (see [Supabase Setup](#supabase-setup) below).

### 3. Run the dev server

```bash
bun run dev
```

Open http://localhost:5173 in your browser.

## Supabase Setup

Supabase provides the database and authentication. Here's how to set it up:

### Create a Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Name it "scs-explorer" (or anything you like)
4. Choose a region close to you
5. Wait ~2 minutes for the database to provision

### Get Your API Keys

1. Go to Settings → API
2. Copy the **Project URL** → paste as `PUBLIC_SUPABASE_URL` in `.env`
3. Copy the **anon public** key → paste as `PUBLIC_SUPABASE_ANON_KEY` in `.env`

### Enable Google OAuth (Optional)

1. Go to Authentication → Providers
2. Click Google and enable it
3. Follow the instructions to set up Google OAuth credentials

### Create Database Tables

Go to SQL Editor and run this:

```sql
-- User profiles
create table profiles (
  id uuid references auth.users primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Favorites
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  item_type text check (item_type in ('material', 'hardware', 'finish')) not null,
  item_id integer not null,
  item_sku text,
  notes text,
  created_at timestamptz default now()
);

-- Enable row-level security
alter table profiles enable row level security;
alter table favorites enable row level security;

-- Security policies
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can read own favorites" on favorites for select using (auth.uid() = user_id);
create policy "Users can insert own favorites" on favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete own favorites" on favorites for delete using (auth.uid() = user_id);
```

## Deployment (Fly.io)

### First Time Setup

1. Install the Fly CLI: https://fly.io/docs/hands-on/install-flyctl/

2. Login to Fly:
```bash
fly auth login
```

3. Launch the app (creates it on Fly):
```bash
fly launch --no-deploy
```

4. Set your secrets:
```bash
fly secrets set PUBLIC_SUPABASE_URL=https://your-project.supabase.co
fly secrets set PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Deploy:
```bash
fly deploy
```

Your app will be live at `https://scs-explorer.fly.dev` (or your chosen name).

### Subsequent Deploys

Just run:
```bash
fly deploy
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | SvelteKit 5 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn-svelte |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |
| Runtime | Bun |
| Deployment | Fly.io |

## Project Structure

```
src/
├── lib/
│   ├── components/ui/     # UI components (Button, Card)
│   ├── scs-api.ts         # SendCutSend API client
│   ├── supabase.ts        # Supabase client
│   └── database.types.ts  # Database types
├── routes/
│   ├── materials/         # Materials page
│   ├── hardware/          # Hardware page
│   ├── finishes/          # Finishes page
│   └── login/             # Auth page
└── app.css                # Global styles
```

## Using with Claude Code / OpenCode

This project includes a `CLAUDE.md` file that helps AI coding assistants understand the codebase. When asking for help:

1. The AI will understand the project structure
2. It knows about Svelte 5 runes syntax
3. It knows how to use the SCS API client
4. It knows how to work with Supabase

Just describe what you want to build and the AI can help!

## License

MIT
