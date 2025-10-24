import { redirect } from 'next/navigation';
import Panel from '@/components/Panel';
import { getServerComponentClient } from '@/lib/supabaseServer';

type PlayerAssetRecord = {
  id: string;
  quantity: number | null;
  created_at: string;
  asset?: {
    name?: string | null;
    category?: string | null;
    description?: string | null;
    price?: number | null;
  } | null;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AssetsPage() {
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

  const { data: assets } = await supabase
    .from('player_assets')
    .select('id, quantity, created_at, asset:asset_id(name, category, description, price)')
    .eq('player_id', player.id)
    .order('created_at', { ascending: false });

  const playerAssets = (assets ?? []) as PlayerAssetRecord[];

  const totalQuantity = playerAssets.reduce((total, record) => total + (record.quantity ?? 0), 0);
  const totalValue = playerAssets.reduce((total, record) => {
    const price = Number(record.asset?.price ?? 0);
    return total + price * (record.quantity ?? 0);
  }, 0);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#9a9a9a]">Assets</p>
        <h1 className="text-3xl font-light uppercase tracking-[0.3em] text-[#d9d9d9]">Portfolio Overview</h1>
        <p className="text-sm leading-relaxed text-[#9a9a9a]">
          Review the resources under your control, their categories, and the value they contribute to ongoing operations.
        </p>
      </header>

      <Panel title="Summary">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border border-[#2a2a2a] bg-[#151515] p-4">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">Total Assets</p>
            <p className="mt-2 font-mono text-2xl text-[#d9d9d9]">{totalQuantity}</p>
          </div>
          <div className="border border-[#2a2a2a] bg-[#151515] p-4">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">Estimated Value</p>
            <p className="mt-2 font-mono text-2xl text-[#d9d9d9]">${totalValue.toLocaleString()}</p>
          </div>
        </div>
      </Panel>

      <Panel title="Asset Ledger">
        {playerAssets.length > 0 ? (
          <ul className="space-y-4">
            {playerAssets.map((record) => (
              <li key={record.id} className="border border-[#2a2a2a] bg-[#151515] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]">{record.asset?.category ?? 'Asset'}</p>
                    <p className="text-lg font-semibold uppercase tracking-[0.25em] text-[#d9d9d9]">
                      {record.asset?.name ?? 'Unknown asset'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-[#d9d9d9]">Quantity: {record.quantity ?? 0}</p>
                    <p className="font-mono text-xs text-[#9a9a9a]">
                      Acquired {new Date(record.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {record.asset?.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-[#9a9a9a]">{record.asset.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#9a9a9a]">No assets are currently assigned to your profile.</p>
        )}
      </Panel>
    </div>
  );
}
