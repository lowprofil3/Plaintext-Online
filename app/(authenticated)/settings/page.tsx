import { redirect } from 'next/navigation';
import Panel from '@/components/Panel';
import { getServerComponentClient } from '@/lib/supabaseServer';
import ChangeUsernameForm from './ChangeUsernameForm';
import { USERNAME_CHANGE_COOLDOWN_DAYS } from '@/lib/constants';
import { changeUsernameAction, signOutAction } from '../actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = getServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: player } = await supabase
    .from('players')
    .select('username, created_at, stats, username_changed_at')
    .eq('user_id', user.id)
    .maybeSingle();

  const usernameCooldownEndsAt = player?.username_changed_at
    ? new Date(new Date(player.username_changed_at).getTime() + USERNAME_CHANGE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString()
    : null;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#9a9a9a]">Settings</p>
        <h1 className="text-3xl font-light uppercase tracking-[0.3em] text-[#d9d9d9]">Account</h1>
        <p className="text-sm leading-relaxed text-[#9a9a9a]">
          Review your profile details and sign out securely.
        </p>
      </header>

      <Panel title="Account Information">
        <dl className="grid gap-4 text-sm text-[#d9d9d9] sm:grid-cols-2">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">Email</dt>
            <dd className="mt-2 font-mono">{user.email}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">Username</dt>
            <dd className="mt-2 font-mono">{player?.username ?? 'Not set'}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">Joined</dt>
            <dd className="mt-2 font-mono">
              {player?.created_at ? new Date(player.created_at).toLocaleString() : 'Unknown'}
            </dd>
          </div>
        </dl>
      </Panel>

      <Panel title="Identity">
        <p className="text-sm leading-relaxed text-[#9a9a9a]">
          Update your operator handle. Changes propagate across jobs, markets, and messages but are limited to once every 10 days to protect identity continuity.
        </p>
        <ChangeUsernameForm
          action={changeUsernameAction}
          currentUsername={player?.username}
          cooldownEndsAt={usernameCooldownEndsAt}
        />
      </Panel>

      <Panel title="Session">
        <form action={signOutAction}>
          <button
            type="submit"
            className="border border-[#009966] bg-[#009966] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#111111]"
          >
            Sign Out
          </button>
        </form>
      </Panel>
    </div>
  );
}
