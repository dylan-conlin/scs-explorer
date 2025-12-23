# SCS Explorer

A SvelteKit 5 web app for exploring SendCutSend's materials, hardware, and finishes catalog.

## Quick Start

```bash
bun install          # Install dependencies
bun run dev          # Start dev server at http://localhost:5173
```

## Stack

- **Framework:** SvelteKit 5 (Svelte 5 with runes)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn-svelte (in `src/lib/components/ui/`)
- **Database:** Supabase (Postgres + Auth)
- **Deployment:** Fly.io
- **Runtime:** Bun

## Project Structure

```
src/
├── lib/
│   ├── components/ui/     # shadcn-svelte components (Button, Card, etc.)
│   ├── scs-api.ts         # SendCutSend API client (fully typed)
│   ├── supabase.ts        # Supabase client setup
│   ├── database.types.ts  # Supabase table types
│   └── utils.ts           # Utility functions (cn for classnames)
├── routes/
│   ├── +page.svelte       # Home page (dashboard)
│   ├── +layout.svelte     # Root layout (imports CSS)
│   ├── +layout.server.ts  # Server layout (session handling)
│   ├── materials/         # Materials browser
│   ├── hardware/          # Hardware catalog
│   ├── finishes/          # Finish options gallery
│   ├── login/             # Login page
│   └── auth/              # OAuth callbacks
├── app.css                # Tailwind + theme variables
├── app.d.ts               # TypeScript type augmentations
└── hooks.server.ts        # Supabase session middleware
```

## Key Files

### `src/lib/scs-api.ts`
Typed client for the SendCutSend public API. No auth needed.

```typescript
import { getMaterials, getHardware, getFinishOptions } from '$lib/scs-api';

// Get all materials
const materials = await getMaterials();

// Get materials with full datasheets
const materialsWithSpecs = await getMaterials({ includeDatasheet: true });

// Filter by SKU
const aluminumPlate = await getMaterialBySku('ALU-125');
```

### `src/lib/supabase.ts`
Supabase client for auth and database.

```typescript
import { createClient } from '$lib/supabase';

const supabase = createClient();

// Auth
await supabase.auth.signInWithPassword({ email, password });
await supabase.auth.signInWithOAuth({ provider: 'google' });

// Database (after setting up tables)
const { data } = await supabase.from('favorites').select('*');
```

## Adding UI Components

We're using shadcn-svelte components. To add a new component:

1. Check available components at https://shadcn-svelte.com/docs/components
2. Create the component manually in `src/lib/components/ui/{component}/`
3. Or use: `bunx shadcn-svelte@latest add {component}` (if CLI works)

**Existing components:** Button, Card (with CardHeader, CardTitle, CardContent, CardDescription, CardFooter)

## Svelte 5 Patterns

This project uses Svelte 5 with runes. Key patterns:

```svelte
<script lang="ts">
  // Props with $props()
  let { data }: Props = $props();
  
  // Reactive state with $state()
  let count = $state(0);
  
  // Derived values with $derived()
  let doubled = $derived(count * 2);
  
  // Effects with $effect()
  $effect(() => {
    console.log('count changed:', count);
  });
</script>

<!-- Snippets instead of slots -->
{#snippet header()}
  <h1>Title</h1>
{/snippet}

<!-- Render snippets -->
{@render header()}
```

## Data Flow

```
SCS Public API (no auth needed)
    ↓
+page.ts load function fetches data
    ↓
+page.svelte receives data via props
    ↓
User interactions trigger $state updates
    ↓
$derived values automatically update UI
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Required for auth/database (get from Supabase dashboard)
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Supabase Setup (One-time)

1. Create account at supabase.com
2. Create new project "scs-explorer"
3. Go to Settings → API → Copy URL and anon key
4. Authentication → Providers → Enable Google (optional)

### Database Tables (run in Supabase SQL editor)

```sql
-- User profiles (auto-created on signup)
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

-- Enable RLS
alter table profiles enable row level security;
alter table favorites enable row level security;

-- Policies
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can read own favorites" on favorites for select using (auth.uid() = user_id);
create policy "Users can insert own favorites" on favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete own favorites" on favorites for delete using (auth.uid() = user_id);
```

## Deployment (Fly.io)

```bash
# First time setup
fly auth login
fly launch --no-deploy

# Set secrets
fly secrets set PUBLIC_SUPABASE_URL=https://xxx.supabase.co
fly secrets set PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Deploy
fly deploy
```

## Common Tasks

### Add a new page
1. Create `src/routes/my-page/+page.svelte`
2. Optionally add `+page.ts` for data loading

### Add a new API data type
1. Update types in `src/lib/scs-api.ts`
2. Add helper functions if needed

### Style with Tailwind
Use Tailwind classes directly in components. Theme colors defined in `src/app.css`.

### Add form handling
Use Svelte's reactive bindings:
```svelte
<input bind:value={email} />
```

## Troubleshooting

**TypeScript errors about $types or env vars:**
Run `bun run dev` once to generate SvelteKit types.

**Supabase auth not working:**
Check that PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set correctly in `.env`.

**Styles not applying:**
Make sure `src/app.css` is imported in `src/routes/+layout.svelte`.
