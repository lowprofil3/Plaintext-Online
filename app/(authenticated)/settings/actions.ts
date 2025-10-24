'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import type { ActionState } from '@/lib/actionState';
import type { Database } from '@/lib/database.types';
import { USERNAME_CHANGE_COOLDOWN_DAYS } from '@/lib/constants';

const USERNAME_COOLDOWN_MS = USERNAME_CHANGE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

export async function changeUsernameAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const requestedUsername = formData.get('username')?.toString().trim();

  if (!requestedUsername) {
    return { error: 'Username is required.' };
  }

  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in.' };
  }

  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('id, username, username_changed_at')
    .eq('user_id', user.id)
    .single();

  if (playerError || !player) {
    return { error: playerError?.message ?? 'Player profile not found.' };
  }

  if (player.username === requestedUsername) {
    return { error: 'Choose a different username.' };
  }

  const lastChangedAt = new Date(player.username_changed_at);
  const cooldownEndsAt = new Date(lastChangedAt.getTime() + USERNAME_COOLDOWN_MS);

  if (cooldownEndsAt.getTime() > Date.now()) {
    return {
      error: `Username can be updated again on ${cooldownEndsAt.toLocaleString()}.`,
    };
  }

  const { data: conflictingPlayers, error: conflictError } = await supabase
    .from('players')
    .select('id')
    .eq('username', requestedUsername)
    .limit(1);

  if (conflictError) {
    return { error: conflictError.message };
  }

  const conflictingPlayer = conflictingPlayers?.[0];

  if (conflictingPlayer && conflictingPlayer.id !== player.id) {
    return { error: 'That username is already taken.' };
  }

  const { error: authError } = await supabase.auth.updateUser({ data: { username: requestedUsername } });

  if (authError) {
    return { error: authError.message };
  }

  const nowIso = new Date().toISOString();
  const { error: updateError } = await supabase
    .from('players')
    .update({ username: requestedUsername, username_changed_at: nowIso, updated_at: nowIso })
    .eq('id', player.id);

  if (updateError) {
    await supabase.auth.updateUser({ data: { username: player.username } }).catch(() => undefined);
    return { error: updateError.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/jobs');
  revalidatePath('/market');
  revalidatePath('/assets');
  revalidatePath('/messages');
  revalidatePath('/settings');

  return { success: 'Username updated successfully.' };
}
