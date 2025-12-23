# SCS Explorer

A SvelteKit 5 web app for exploring SendCutSend's materials, hardware, and finishes catalog.

## Machine Setup (First Time Only)

If you're setting up a new Mac for development, run these commands in Terminal.

### 1. Install Homebrew (Mac package manager)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After it finishes, follow the instructions it prints to add brew to your PATH.

### 2. Install Development Tools

```bash
# Node.js (needed for Claude Code)
brew install node

# Bun (JavaScript runtime, faster than Node)
brew install oven-sh/bun/bun

# Git (version control)
brew install git

# GitHub CLI (for pushing to GitHub)
brew install gh

# Fly.io CLI (for deployment)
brew install flyctl

# Go (needed to build kn)
brew install go
```

### 3. Configure Git (one time)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 4. Login to GitHub

```bash
gh auth login
```

Follow the prompts - it will open a browser to authenticate.

### 5. Login to Fly.io (when ready to deploy)

```bash
fly auth login
```

### Verify Everything Works

```bash
node --version     # Should print a version number
bun --version      # Should print a version number
git --version      # Should print a version number
gh --version       # Should print a version number
fly version        # Should print a version number
go version         # Should print a version number
```

### 6. Install Claude Code (AI coding assistant)

```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code
```

The first time you run `claude`, it will open a browser to authenticate with your Anthropic account.

**Why Claude Code?** It's a terminal-based AI that can:
- Read and edit files in your project
- Run commands (like `bun run dev`)
- Search your codebase to understand how things work
- Make changes across multiple files at once

### Using Claude Code

**Start Claude Code in your project:**
```bash
cd ~/Documents/scs-explorer
claude
```

**Talk to it like a person.** Just type what you want:
- "run the dev server"
- "show me the materials page code"
- "add a search box to filter materials by name"
- "why is the login button not working?"
- "commit my changes with a good message"

**Example conversation:**
```
You: add a favorites button to each material card
Claude: [reads the code, makes changes, shows you what it did]

You: make the button red when favorited
Claude: [updates the code]

You: test it by running the dev server
Claude: [runs bun run dev]
```

### Claude Code Tips

- Be specific ("add a search input that filters materials by name" not just "add search")
- Ask it to explain things ("how does the materials page load data?")
- Ask it to commit when you're happy with changes ("commit this with message: Add favorites button")
- If something breaks, say "undo that" or ask it to fix the error
- Say "run the dev server" to see your changes in the browser

## Quick Start

```bash
bun install          # Install dependencies
bun run dev          # Start dev server at http://localhost:5173
```

> **Note:** If port 5173 is already in use, the server will automatically pick another port (5174, 5175, etc.). Check the terminal output to see which port it's using.

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

## Remembering Decisions Across Sessions (kn)

**Problem:** AI assistants forget decisions from previous sessions. You end up re-explaining "we decided to use blue buttons" every time.

**Solution:** `kn` saves decisions to a file that Claude Code can read.

### Install kn

```bash
# Create ~/bin folder and add to PATH (one time)
mkdir -p ~/bin
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Clone and build (one time)
cd ~/Documents
git clone https://github.com/dylanconlin/kn.git
cd kn && go build -o ~/bin/kn ./cmd/kn

# Initialize in your project
cd /path/to/scs-explorer
kn init
```

### Basic Commands

```bash
# Record a decision
kn decide "use blue buttons for primary actions" --reason "matches SCS brand guidelines"

# Record something you tried that didn't work
kn tried "using localStorage for favorites" --failed "doesn't sync across devices"

# Record an open question
kn question "should we add dark mode?"

# See what's already been decided about a topic
kn context "buttons"

# See recent decisions
kn recent
```

### Using with Claude Code

When starting a new session, you can say:
> "Run `kn context materials` to see what we've decided about the materials page"

Or ask Claude Code to record decisions:
> "That worked! Record this decision with kn"

### What to Record

**Worth recording:**
- Design decisions ("blue buttons", "card layout for materials")
- Things that didn't work ("tried X, but it broke Y")
- Constraints ("images must be under 500KB")

**Not worth recording:**
- How code works (that's what the code is for)
- Temporary experiments
- One-off fixes

### The .kn Folder

After `kn init`, your project has a `.kn/` folder:
```
.kn/
└── entries.jsonl    # All your decisions (git-tracked)
```

This file gets committed to git, so your decisions travel with the code.

## Git Workflow

Git saves "checkpoints" of your code so you can go back if something breaks.

### Daily Workflow

```bash
# 1. Check what changed
git status

# 2. Save your changes (create a checkpoint)
git add .
git commit -m "Add favorites button to materials page"

# 3. Upload to GitHub (backup + share)
git push
```

### Understanding Git Status

```bash
git status
```

This shows:
- **Untracked files** - New files git doesn't know about yet
- **Modified files** - Files you changed
- **Staged files** - Files ready to be committed

### Commit Messages

Write what you did, not how:

```bash
# Good
git commit -m "Add search filter to materials page"
git commit -m "Fix login button not working on mobile"
git commit -m "Update finish swatches to use larger images"

# Not as helpful
git commit -m "Update code"
git commit -m "Fix bug"
```

### If Something Breaks

```bash
# See recent commits
git log --oneline -5

# Go back to the last commit (discard uncommitted changes)
git checkout .

# Go back to a specific commit (use hash from git log)
git checkout abc1234
```

### Working with GitHub

```bash
# First time: Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/scs-explorer.git
git push -u origin main

# After that, just:
git push
```

### Common Situations

**"I want to save my work"**
```bash
git add .
git commit -m "Describe what you did"
```

**"I broke something and want to undo"**
```bash
git checkout .
```

**"I want to see what I changed"**
```bash
git diff
```

**"The agent made changes, should I keep them?"**
1. Run `git diff` to see what changed
2. Test if it works
3. If good: `git add . && git commit -m "Agent: added feature X"`
4. If bad: `git checkout .` to undo

### Tips

- Commit often (after each working feature)
- Push at end of each session (backup to GitHub)
- Write commits you'll understand later
- Don't be afraid to experiment - you can always undo

## Troubleshooting

**TypeScript errors about $types or env vars:**
Run `bun run dev` once to generate SvelteKit types.

**Supabase auth not working:**
Check that PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set correctly in `.env`.

**Styles not applying:**
Make sure `src/app.css` is imported in `src/routes/+layout.svelte`.
