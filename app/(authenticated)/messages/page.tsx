import { redirect } from 'next/navigation';
import Panel from '@/components/Panel';
import MessageList from '@/components/MessageList';
import { getServerComponentClient } from '@/lib/supabaseServer';
import { sendMessageAction } from '../actions';
import SendMessageForm from './SendMessageForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export default async function MessagesPage() {
  const supabase = getServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: player } = await supabase
    .from('players')
    .select('id, username')
    .eq('user_id', user.id)
    .single();

  if (!player) {
    redirect('/settings');
  }

  const { data: messages } = await supabase
    .from('messages')
    .select('id, body, created_at, sender:sender_id(username), recipient:recipient_id(username)')
    .or(`sender_id.eq.${player.id},recipient_id.eq.${player.id}`)
    .order('created_at', { ascending: false });

  const conversation = (messages ?? []) as MessageRecord[];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#9a9a9a]">Messages</p>
        <h1 className="text-3xl font-light uppercase tracking-[0.3em] text-[#d9d9d9]">Communications</h1>
        <p className="text-sm leading-relaxed text-[#9a9a9a]">
          Exchange briefings and updates with other operators. Messages older than 48 hours are automatically archived.
        </p>
      </header>

      <Panel title="Compose Message">
        <SendMessageForm action={sendMessageAction} />
      </Panel>

      <Panel title="Inbox & Outbox">
        <MessageList messages={conversation} />
      </Panel>
    </div>
  );
}
