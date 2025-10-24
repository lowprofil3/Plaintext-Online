# PlainText Online

PlainText Online is a text-forward massively multiplayer RPG set in a persistent, modern city. The world operates like a living terminal — players clock in to jobs, grind reputation, build up assets, and chatter in plaintext.

This repository now contains two complementary experiences:

- **Next.js web client** that visualises the operator dashboard in a sleek terminal-inspired interface.
- **Domain + services layer** that models players, assets, and stat regeneration while wiring into Supabase for persistence.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Launch the Next.js development server:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to explore the City Operations Dashboard mock.

3. Provide Supabase credentials when you are ready to exercise live auth and persistence:

   ```bash
   export SUPABASE_URL=your-project-url
   export SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the domain unit tests to keep the regeneration loop honest:

   ```bash
   npm test
   ```

5. (Optional) Inspect the CLI bootstrapper for raw domain output:

   ```bash
   npm run cli
   ```

   The script logs starting stats for a new citizen and simulates stat regeneration after downtime. When Supabase credentials are present it also exposes helper methods for registering, logging in, and fetching player profiles.

## Core systems

### Operator dashboard prototype

The landing page showcases how the MMO can surface real-time context in plaintext:

- **Stats panel** mirrors the live energy and focus regeneration schedule using the shared domain service.
- **City feed** communicates economic and social shifts across the metropolis.
- **Objectives & assets** keep players focused on their routine and holdings.
- **Command log** hints at the eventual command-driven interaction model.

Tailwind CSS powers the neon terminal aesthetic while Next.js server components pull in the shared domain logic.

### Player profile blueprint

Every new citizen starts with the following profile:

- Cash: **$200**
- Energy: **50**
- Focus: **50**
- Reputation: **0**
- Assets: **Small Apartment**

Player metadata is stored in a JSONB-friendly shape that Supabase can persist without complex migrations.

### Stat regeneration

Energy and focus replenish automatically using server timestamps:

| Stat   | Amount per tick | Interval | Notes                     |
| ------ | ---------------- | -------- | ------------------------- |
| Energy | +5               | 5 min    | Caps at 100               |
| Focus  | +2               | 10 min   | Caps at 100               |

Regeneration happens lazily — whenever a profile is loaded the `StatRegenerationService` calculates the elapsed time, applies the correct number of ticks, and persists the result.

### Authentication approach

Supabase requires an email field for password auth. To keep the UX purely username-driven, the `PlayerService` synthesises an email (`<username>@players.plaintext-online.local`) that is never exposed to the player. Metadata persists the canonical username, enabling terminal-style login prompts while using Supabase's secure credential storage.

### Database schema

Provision a `players` table in Supabase using the SQL snippet in [`supabase/schema.sql`](supabase/schema.sql). The JSONB columns allow the prototype to evolve quickly without migrations while the domain model is still in flux.

## Next steps

- Flesh out authentication flows in the Next.js app using the Supabase client.
- Layer in job systems, commerce, and social features using the same domain-first approach.
- Expand automated tests to cover Supabase adapters and future gameplay systems.
