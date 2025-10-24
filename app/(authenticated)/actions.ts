'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import type { ActionState } from '@/lib/actionState';

export const USERNAME_CHANGE_COOLDOWN_DAYS = 10;
const USERNAME_COOLDOWN_MS = USERNAME_CHANGE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

export async function workJobAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const jobId = formData.get('job_id')?.toString();

  if (!jobId) {
    return { error: 'Select a job to work.' };
  }

  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in.' };
  }

  const { error } = await supabase.rpc('work_job', { job_id: jobId });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/jobs');
  revalidatePath('/market');
  revalidatePath('/assets');

  return { success: 'Job executed successfully.' };
}

export async function sendMessageAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const recipient = formData.get('recipient')?.toString().trim();
  const body = formData.get('body')?.toString().trim();

  if (!recipient || !body) {
    return { error: 'Recipient and message are required.' };
  }

  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in.' };
  }

  const { data: senderPlayer, error: playerError } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (playerError || !senderPlayer) {
    return { error: playerError?.message ?? 'Player profile not found.' };
  }

  const { data: recipientPlayer } = await supabase
    .from('players')
    .select('id')
    .eq('username', recipient)
    .maybeSingle();

  if (!recipientPlayer) {
    return { error: 'Recipient not found.' };
  }

  const { error } = await supabase.from('messages').insert({
    sender_id: senderPlayer.id,
    recipient_id: recipientPlayer.id,
    body,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/messages');
  return { success: 'Message sent.' };
}

export async function purchaseAssetAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const assetId = formData.get('asset_id')?.toString();

  if (!assetId) {
    return { error: 'Select an asset to purchase.' };
  }

  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in.' };
  }

  const { error } = await supabase.rpc('purchase_asset', { asset_id: assetId });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/market');
  revalidatePath('/assets');
  revalidatePath('/dashboard');

  return { success: 'Asset purchased successfully.' };
}

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

  const { data: conflictingPlayer, error: conflictError } = await supabase
    .from('players')
    .select('id')
    .eq('username', requestedUsername)
    .maybeSingle();

  if (conflictError) {
    return { error: conflictError.message };
  }

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

export async function signOutAction() {
  const supabase = createServerActionClient<Database>({ cookies });
  await supabase.auth.signOut();
  revalidatePath('/');
  redirect('/');
}

