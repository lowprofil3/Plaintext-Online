# PlainText Online

PlainText Online is a text-forward massively multiplayer RPG set in a persistent, modern city. The world operates like a living terminal — players clock in to jobs, grind reputation, build up assets, and chatter in plaintext.

This repository currently houses a lightweight prototype of the core backend concepts:

- Username + password authentication handled by Supabase.
- Automatic player provisioning with starting cash, stats, and assets.
- Deterministic stat regeneration for energy and focus over real-world time.
- A TypeScript foundation ready to wire into a terminal-inspired UI or API layer.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Provide Supabase credentials (needed for live auth and persistence):

   ```bash
   export SUPABASE_URL=your-project-url
   export SUPABASE_ANON_KEY=your-anon-key
   ```

3. Explore the prototype via the CLI bootstrapper:

   ```bash
   npm start
   ```

   The script logs starting stats for a new citizen and simulates stat regeneration after downtime. When Supabase credentials are present it also exposes helper methods for registering, logging in, and fetching player profiles.

4. Run the Vitest-powered unit suite:

   ```bash
   npm test
   ```

   Tests cover the player factory helpers, persistence mapping, and the stat regeneration logic to protect against regressions while the domain evolves.

## Core systems

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

- Build a terminal-inspired UI that consumes the player and session services.
- Layer in job systems, commerce, and social features using the same domain-first approach.
- Add automated tests once the domain stabilises.
