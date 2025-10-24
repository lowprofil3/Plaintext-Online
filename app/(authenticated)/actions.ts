'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import type { ActionState } from '@/lib/actionState';
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

export async function signOutAction() {
  const supabase = createServerActionClient<Database>({ cookies });
  await supabase.auth.signOut();
  revalidatePath('/');
  redirect('/');
}

