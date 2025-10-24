import { redirect } from 'next/navigation';
import JobCard from '@/components/JobCard';
import Panel from '@/components/Panel';
import { getServerComponentClient } from '@/lib/supabaseServer';
import { workJobAction } from '../actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PlayerStats = {
  energy?: number;
  focus?: number;
  reputation?: number;
};

export default async function JobsPage() {
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

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, description, energy_cost, focus_cost, base_payout, reputation_required')
    .order('reputation_required', { ascending: true });

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#9a9a9a]">Job Board</p>
        <h1 className="text-3xl font-light uppercase tracking-[0.3em] text-[#d9d9d9]">Available Contracts</h1>
        <p className="text-sm leading-relaxed text-[#9a9a9a]">
          Browse active opportunities. Jobs consume energy and focus but deliver cash payouts and reputation gains.
        </p>
      </header>

      <Panel title="Current Capacity" className="border border-[#2a2a2a] bg-[#151515]">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">Energy</p>
            <p className="mt-1 font-mono text-2xl text-[#d9d9d9]">{stats.energy ?? 0}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">Focus</p>
            <p className="mt-1 font-mono text-2xl text-[#d9d9d9]">{stats.focus ?? 0}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">Reputation</p>
            <p className="mt-1 font-mono text-2xl text-[#d9d9d9]">{stats.reputation ?? 0}</p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 md:grid-cols-2">
        {(jobs ?? []).map((job) => (
          <JobCard key={job.id} job={job} action={workJobAction} />
        ))}
      </div>
    </div>
  );
}
