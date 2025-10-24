import { redirect } from 'next/navigation';
import Panel from '@/components/Panel';
import MessageList from '@/components/MessageList';
import { getServerComponentClient } from '@/lib/supabaseServer';
import { workJobAction } from '../actions';
import DashboardRefresh from './DashboardRefresh';
import WorkJobForm from './WorkJobForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PlayerStats = {
  energy?: number;
  focus?: number;
  cash?: number;
  reputation?: number;
};

type MessageRecord = {
  id: string;
  body: string;
  created_at: string;
  sender?: {
    username?: string | null;
  } | null;
  recipient?: {
    username?: string | null;
  } | null;
};

export default async function DashboardPage() {
  const supabase = getServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: player } = await supabase
    .from('players')
    .select('id, username, stats')
    .eq('user_id', user.id)
    .single();

  if (!player) {
    redirect('/settings');
  }

  const stats = (player.stats as PlayerStats | null) ?? {};

  const { data: playerAssets } = await supabase
    .from('player_assets')
    .select('id, quantity')
    .eq('player_id', player.id);

  const assetsCount = playerAssets?.reduce((total, asset) => total + (asset.quantity ?? 0), 0) ?? 0;

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title')
    .order('reputation_required', { ascending: true });

  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, amount, description, created_at, type')
    .eq('player_id', player.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: recentMessages } = await supabase
    .from('messages')
    .select('id, body, created_at, sender:sender_id(username), recipient:recipient_id(username)')
    .or(`sender_id.eq.${player.id},recipient_id.eq.${player.id}`)
    .order('created_at', { ascending: false })
    .limit(5);

  const latestMessages = (recentMessages ?? []) as MessageRecord[];

  const formattedStats = [
    {
      label: 'Cash',
      value: `$${Number(stats.cash ?? 0).toLocaleString()}`,
      context: 'Liquid funds available for contracts and assets.',
    },
    {
      label: 'Energy',
      value: `${stats.energy ?? 0}`,
      context: 'Expended when completing intensive jobs.',
    },
    {
      label: 'Focus',
      value: `${stats.focus ?? 0}`,
      context: 'Required for complex planning and strategy work.',
    },
    {
      label: 'Reputation',
      value: `${stats.reputation ?? 0}`,
      context: 'Determines access to higher tier jobs and assets.',
    },
    {
      label: 'Assets',
      value: `${assetsCount}`,
      context: 'Total assets currently managed by your operator profile.',
    },
  ];

  return (
    <>
      <DashboardRefresh />
      <header className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#9a9a9a]">PlainText Online</p>
        <h1 className="text-3xl font-light uppercase tracking-[0.3em] text-[#d9d9d9]">
          Welcome, {player.username}
        </h1>
        <p className="text-sm leading-relaxed text-[#9a9a9a]">
          Monitor your core stats, run contracts, and stay on top of the city feed. Data updates every minute.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-12">
        <Panel className="lg:col-span-7" title="Operator Status">
          <div className="grid gap-4 sm:grid-cols-2">
            {formattedStats.map((stat) => (
              <div key={stat.label} className="space-y-3 border border-[#2a2a2a] bg-[#151515] p-4">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">{stat.label}</p>
                <p className="font-mono text-2xl text-[#d9d9d9]">{stat.value}</p>
                <p className="text-sm leading-relaxed text-[#9a9a9a]">{stat.context}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="lg:col-span-5" title="Run Work">
          <p className="text-sm leading-relaxed text-[#9a9a9a]">
            Choose a job from your unlocked opportunities to generate income and build reputation. Executing work updates your stats
            immediately.
          </p>
          <div className="mt-4">
            <WorkJobForm jobs={jobs ?? []} action={workJobAction} />
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Panel className="lg:col-span-7" title="Recent Transactions">
          {transactions && transactions.length > 0 ? (
            <ul className="divide-y divide-[#2a2a2a] border border-[#2a2a2a]">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="flex flex-col gap-2 bg-[#151515] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-[#d9d9d9]">{transaction.description}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]">{transaction.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-base text-[#009966]">
                      {transaction.amount >= 0 ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="font-mono text-xs text-[#9a9a9a]">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#9a9a9a]">No transactions recorded yet.</p>
          )}
        </Panel>

        <Panel className="lg:col-span-5" title="Latest Messages">
          <MessageList messages={latestMessages} />
        </Panel>
      </section>
    </>
  );
}
