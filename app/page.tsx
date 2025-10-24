import Header from '@/components/Header';
import Panel from '@/components/Panel';
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

const cityFeed = [
  {
    label: 'Job Board',
    description: 'Courier shift demand rising in the Riverfront district. Payout forecast at $55.'
  },
  {
    label: 'Market',
    description: 'Shared studio lease posted by Union Square Collective. Requires reputation 18.'
  },
  {
    label: 'Transit',
    description: 'Night routes reduced for maintenance. Expect longer travel between 23:00-02:00.'
  },
];

const assets = [
  {
    category: 'Residential',
    name: 'Loft Micro Unit',
    status: 'Occupancy 1 / 1',
    description: 'Compact loft downtown. Provides +10 focus recovery bonus when rested before 08:00.'
  },
  {
    category: 'Workspace',
    name: 'Co-op Desk Share',
    status: 'Access 3 days / week',
    description: 'Quiet co-working slot overlooking the canal. Network boost for market research commands.'
  },
];

const commandLog = [
  { time: '07:45', action: 'Queued delivery contract for Uptown Media Hub.' },
  { time: '06:30', action: 'Transferred 150 credits to emergency reserve.' },
  { time: '05:50', action: 'Reviewed reputation metrics — standing stable at 42.' },
  { time: '05:15', action: 'Synced asset maintenance schedule with facility manager.' },
];

export default function HomePage() {
  const preview = buildRegenerationPreview();

  const operatorStats = [
    {
      label: 'Energy',
      value: `${preview.stats.energy} / 100`,
      context: `+5 every 5 minutes · next tick ${formatTickTime(preview.nextEnergyTickAt)} (${relativeMinutes(preview.nextEnergyTickAt)})`,
    },
    {
      label: 'Focus',
      value: `${preview.stats.focus} / 100`,
      context: `+2 every 10 minutes · next tick ${formatTickTime(preview.nextFocusTickAt)} (${relativeMinutes(preview.nextFocusTickAt)})`,
    },
    {
      label: 'Cash',
      value: `$${preview.stats.cash}`,
      context: 'Liquid funds reserved for contracts, supplies, and transport.',
    },
    {
      label: 'Reputation',
      value: `${preview.stats.reputation} / 100`,
      context: 'Determines access to higher tier gigs and communal assets.',
    },
  ];

  return (
    <main className="px-6 pb-12 pt-8 md:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <Header />

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <Panel title="Operator Status">
              <div className="grid gap-4 sm:grid-cols-2">
                {operatorStats.map((stat) => (
                  <div key={stat.label} className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">{stat.label}</p>
                    <p className="font-mono text-2xl text-[#d9d9d9]">{stat.value}</p>
                    <p className="text-sm leading-relaxed text-[#9a9a9a]">{stat.context}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="City Feed">
              <ul className="space-y-4">
                {cityFeed.map((item) => (
                  <li key={item.label} className="border border-[#2a2a2a] bg-[#151515] p-4">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">{item.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#d9d9d9]">{item.description}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <Panel title="Assets in Holding">
              <ul className="space-y-4">
                {assets.map((item) => (
                  <li key={item.name} className="border border-[#2a2a2a] bg-[#151515] p-4">
                    <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">
                      <span>{item.category}</span>
                      <span>{item.status}</span>
                    </div>
                    <p className="mt-3 text-lg font-medium uppercase tracking-[0.2em] text-[#d9d9d9]">{item.name}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#9a9a9a]">{item.description}</p>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Command Log">
              <ul className="space-y-3">
                {commandLog.map((entry) => (
                  <li key={entry.action} className="flex items-baseline gap-4 border-b border-[#2a2a2a] pb-3 last:border-b-0 last:pb-0">
                    <span className="font-mono text-sm text-[#009966]">{entry.time}</span>
                    <span className="font-mono text-sm text-[#d9d9d9]">{entry.action}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </main>
  );
}
