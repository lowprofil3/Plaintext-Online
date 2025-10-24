import Panel from '@/components/Panel';

const wikiSections = [
  {
    title: 'City Overview',
    content: `PlainText Online is a systems-first MMO. Every contract, market listing, and message runs through Supabase-backed operations. Maintain your stats to unlock higher tiers.`,
  },
  {
    title: 'Stats',
    content: `Energy powers physical work. Focus governs planning and research. Reputation opens restricted jobs and assets. Cash fuels acquisitions. Regeneration occurs automatically based on your schedule and owned assets.`,
  },
  {
    title: 'Jobs',
    content: `Jobs are queued from the dashboard or job board. Each job consumes energy and focus but returns cash and reputation via the work_job RPC. Higher reputation exposes more lucrative opportunities.`,
  },
  {
    title: 'Assets & Market',
    content: `Assets modify regeneration, unlock new commands, or provide passive bonuses. All purchases execute through Supabase functions and immediately update your portfolio.`,
  },
  {
    title: 'Messages',
    content: `Use messages to coordinate with other operators. Messages expire after 48 hours and are automatically archived by a scheduled Supabase task.`,
  },
];

export default function WikiPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#9a9a9a]">Wiki</p>
        <h1 className="text-3xl font-light uppercase tracking-[0.3em] text-[#d9d9d9]">Operator Guide</h1>
        <p className="text-sm leading-relaxed text-[#9a9a9a]">
          Reference the systems powering PlainText Online. This guide is static markdown but always accessible from within the app.
        </p>
      </header>

      <Panel title="PlainText Online — a system where simplicity is the interface.">
        <div className="space-y-6 text-sm leading-relaxed text-[#d9d9d9]">
          {wikiSections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h2 className="text-base font-semibold uppercase tracking-[0.3em] text-[#009966]">{section.title}</h2>
              <p className="text-[#d9d9d9]">{section.content}</p>
            </section>
          ))}
        </div>
      </Panel>
    </div>
  );
}
