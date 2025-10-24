import { createStartingPlayer } from '@/game/domain/player';
import { StatRegenerationService } from '@/game/services/statRegenerationService';

function formatTickTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function relativeMinutes(date: Date) {
  const diffMs = date.getTime() - Date.now();
  const minutes = Math.max(0, Math.round(diffMs / 60000));
  if (minutes === 0) {
    return 'now';
  }
  return `in ${minutes}m`;
}

function buildRegenerationPreview() {
  const player = createStartingPlayer('guest');
  const service = new StatRegenerationService();
  const result = service.applyRegeneration(player);

  return {
    stats: result.updatedPlayer.stats,
    nextEnergyTickAt: result.nextEnergyTickAt,
    nextFocusTickAt: result.nextFocusTickAt,
  };
}

const activityFeed = [
  {
    label: 'Job Board',
    description: 'City Courier shift started — payout $45-65 pending performance review.',
  },
  {
    label: 'Marketplace',
    description: 'Downtown coworking desk lease listed for $120/day. Reputation 20 required.',
  },
  {
    label: 'Broadcast',
    description: 'Public transit strike announced. Expect surge pricing for ride requests tonight.',
  },
];

const routineChecklist = [
  'Check energy-intensive tasks before the next tick.',
  'Claim passive income from owned assets.',
  'Monitor district channels for freelance shifts.',
  'Review market contracts expiring in the next 24h.',
];

export default function HomePage() {
  const preview = buildRegenerationPreview();
  const now = new Date();

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-10">
      <section className="w-full max-w-5xl space-y-6">
        <header className="flex flex-col gap-3 rounded-2xl border border-emerald-500/20 bg-terminal-surface/70 p-6 shadow-glow backdrop-blur">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-terminal-accent/80">PlainText Online</p>
              <h1 className="text-3xl font-semibold text-terminal-primary">
                City Operations Dashboard
              </h1>
            </div>
            <div className="rounded-xl border border-terminal-primary/30 bg-terminal-background px-4 py-3 text-right text-xs uppercase tracking-[0.2em] text-terminal-primary/80">
              <p>{now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' })}</p>
              <p>{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} CTZ</p>
            </div>
          </div>
          <p className="max-w-2xl text-sm text-emerald-50/70">
            PlainText Online mirrors a living metropolis. Every command syncs with the persistent city — jobs, housing, markets, and social capital evolve even when you&apos;re offline.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-5">
          <div className="space-y-6 md:col-span-3">
            <div className="rounded-2xl border border-terminal-primary/30 bg-terminal-surface/80 p-6">
              <h2 className="text-sm uppercase tracking-[0.3em] text-terminal-accent/70">Operator Status</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-terminal-primary/20 bg-terminal-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-terminal-primary/60">Energy</p>
                  <p className="mt-2 text-3xl font-semibold text-terminal-primary">
                    {preview.stats.energy}
                    <span className="text-sm text-terminal-primary/60"> / 100</span>
                  </p>
                  <p className="mt-3 text-xs text-terminal-accent/80">
                    +5 every 5 minutes · next tick {formatTickTime(preview.nextEnergyTickAt)} ({relativeMinutes(preview.nextEnergyTickAt)})
                  </p>
                </div>
                <div className="rounded-xl border border-terminal-primary/20 bg-terminal-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-terminal-primary/60">Focus</p>
                  <p className="mt-2 text-3xl font-semibold text-terminal-primary">
                    {preview.stats.focus}
                    <span className="text-sm text-terminal-primary/60"> / 100</span>
                  </p>
                  <p className="mt-3 text-xs text-terminal-accent/80">
                    +2 every 10 minutes · next tick {formatTickTime(preview.nextFocusTickAt)} ({relativeMinutes(preview.nextFocusTickAt)})
                  </p>
                </div>
                <div className="rounded-xl border border-terminal-primary/20 bg-terminal-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-terminal-primary/60">Cash</p>
                  <p className="mt-2 text-3xl font-semibold text-terminal-primary">
                    ${preview.stats.cash}
                    <span className="text-sm text-terminal-primary/60"> starting</span>
                  </p>
                  <p className="mt-3 text-xs text-terminal-accent/80">Liquid funds available for contracts and upgrades.</p>
                </div>
                <div className="rounded-xl border border-terminal-primary/20 bg-terminal-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-terminal-primary/60">Reputation</p>
                  <p className="mt-2 text-3xl font-semibold text-terminal-primary">
                    {preview.stats.reputation}
                    <span className="text-sm text-terminal-primary/60"> / 100</span>
                  </p>
                  <p className="mt-3 text-xs text-terminal-accent/80">Unlocks higher tier gigs, housing, and social circles.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-terminal-primary/30 bg-terminal-surface/80 p-6">
              <h2 className="text-sm uppercase tracking-[0.3em] text-terminal-accent/70">City Feed</h2>
              <ul className="mt-4 space-y-4">
                {activityFeed.map((item) => (
                  <li key={item.label} className="rounded-xl border border-terminal-primary/10 bg-terminal-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-terminal-primary/60">{item.label}</p>
                    <p className="mt-2 text-sm text-emerald-50/80">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6 md:col-span-2">
            <div className="rounded-2xl border border-terminal-primary/30 bg-terminal-surface/80 p-6">
              <h2 className="text-sm uppercase tracking-[0.3em] text-terminal-accent/70">Next Objectives</h2>
              <ul className="mt-4 space-y-3 text-sm text-emerald-50/80">
                {routineChecklist.map((task) => (
                  <li key={task} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-terminal-primary/80" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-terminal-primary/30 bg-terminal-surface/80 p-6">
              <h2 className="text-sm uppercase tracking-[0.3em] text-terminal-accent/70">Assets in Holding</h2>
              <div className="mt-4 space-y-4 text-sm text-emerald-50/80">
                <div className="rounded-xl border border-terminal-primary/10 bg-terminal-background/70 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-terminal-primary/60">
                    <span>Residential</span>
                    <span>Occupancy 1/1</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-terminal-primary">Small Apartment</p>
                  <p className="text-xs text-terminal-accent/70">Modest living space in Old Town. Provides rest bonuses when energy &lt; 30.</p>
                </div>
                <div className="rounded-xl border border-terminal-warning/20 bg-terminal-background/70 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-terminal-warning/70">
                    <span>Logistics</span>
                    <span>Leased</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-terminal-warning">Shared Fleet Access</p>
                  <p className="text-xs text-terminal-warning/70">Reserve vehicles on demand. Fees scale with reputation tiers.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-terminal-primary/30 bg-terminal-surface/80 p-6">
              <h2 className="text-sm uppercase tracking-[0.3em] text-terminal-accent/70">Command Log</h2>
              <div className="mt-4 space-y-2 text-xs text-emerald-50/70">
                <p>&gt; connect citynet/mainframe</p>
                <p>&gt; query jobs --district "Old Town" --energy &lt;= 40</p>
                <p>&gt; accept contract 8842-d</p>
                <p>&gt; schedule rest --location "Small Apartment" --duration 2h</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
