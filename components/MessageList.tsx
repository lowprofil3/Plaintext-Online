interface MessageListProps {
  messages: Array<{
    id: string;
    body: string;
    created_at: string;
    sender?: { username?: string | null } | null;
    recipient?: { username?: string | null } | null;
  }>;
}

const timestampFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export default function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return <p className="text-sm text-[#9a9a9a]">No messages available.</p>;
  }

  return (
    <ul className="space-y-4">
      {messages.map((message) => (
        <li key={message.id} className="border border-[#2a2a2a] bg-[#151515] p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]">
              <span>From </span>
              <span className="text-[#d9d9d9]">{message.sender?.username ?? 'Unknown'}</span>
              <span> to </span>
              <span className="text-[#d9d9d9]">{message.recipient?.username ?? 'Unknown'}</span>
            </div>
            <span className="font-mono text-xs text-[#9a9a9a]">
              {timestampFormatter.format(new Date(message.created_at))}
            </span>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#d9d9d9]">{message.body}</p>
        </li>
      ))}
    </ul>
  );
}
