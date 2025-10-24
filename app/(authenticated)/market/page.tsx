import { redirect } from 'next/navigation';
import Panel from '@/components/Panel';
import { getServerComponentClient } from '@/lib/supabaseServer';
import { purchaseAssetAction } from '../actions';
import PurchaseAssetCard from './PurchaseAssetCard';

type OwnedAssetRecord = {
  id: string;
  quantity: number | null;
  asset?: {
    name?: string | null;
    category?: string | null;
    description?: string | null;
    price?: number | null;
  } | null;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MarketPage() {
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

  const { data: catalog } = await supabase
    .from('assets_catalog')
    .select('id, name, description, category, price')
    .order('price', { ascending: true });

  const { data: ownedAssets } = await supabase
    .from('player_assets')
    .select('id, quantity, asset:asset_id(name, category, description, price)')
    .eq('player_id', player.id)
    .order('created_at', { ascending: false });

  const inventory = (ownedAssets ?? []) as OwnedAssetRecord[];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#9a9a9a]">Market</p>
        <h1 className="text-3xl font-light uppercase tracking-[0.3em] text-[#d9d9d9]">Asset Exchange</h1>
        <p className="text-sm leading-relaxed text-[#9a9a9a]">
          Acquire workspaces, tools, and living spaces. Purchases execute against live balances and update your operator profile.
        </p>
      </header>

      <Panel title="Assets in Portfolio">
        {inventory.length > 0 ? (
          <ul className="space-y-4">
            {inventory.map((record) => (
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
                    {record.asset?.price ? (
                      <p className="font-mono text-xs text-[#9a9a9a]">Value: ${record.asset.price.toLocaleString()}</p>
                    ) : null}
                  </div>
                </div>
                {record.asset?.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-[#9a9a9a]">{record.asset.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#9a9a9a]">You have not acquired any assets yet.</p>
        )}
      </Panel>

      <Panel title="Available Assets">
        <div className="grid gap-6 md:grid-cols-2">
          {(catalog ?? []).map((asset) => (
            <PurchaseAssetCard key={asset.id} asset={asset} action={purchaseAssetAction} />
          ))}
        </div>
      </Panel>
    </div>
  );
}
