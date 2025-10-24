const formatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
});

export default function Header() {
  const now = new Date();

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#9a9a9a]">PlainText Online</p>
          <h1 className="text-2xl font-light uppercase tracking-[0.35em] text-[#d9d9d9]">City Operations Dashboard</h1>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-[#9a9a9a]">
          PlainText Online — a system where simplicity is the interface. Monitor your operator status, follow the city feed, and
          keep every command accounted for.
        </p>
      </div>
      <div className="text-right text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">
        <p>{formatter.format(now)}</p>
        <p>{timeFormatter.format(now)} CTZ</p>
      </div>
    </header>
  );
}
