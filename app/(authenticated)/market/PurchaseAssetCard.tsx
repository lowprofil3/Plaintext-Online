'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { ActionState } from '@/lib/actionState';

const INITIAL_STATE: ActionState = {};

interface PurchaseAssetCardProps {
  asset: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    price: number;
  };
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-[#009966] bg-[#009966] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Purchasing…' : 'Purchase'}
    </button>
  );
}

export default function PurchaseAssetCard({ asset, action }: PurchaseAssetCardProps) {
  const [state, formAction] = useFormState(action, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4 border border-[#2a2a2a] bg-[#151515] p-5">
      <input type="hidden" name="asset_id" value={asset.id} />
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#9a9a9a]">{asset.category ?? 'Asset'}</p>
        <h3 className="text-lg font-semibold uppercase tracking-[0.25em] text-[#d9d9d9]">{asset.name}</h3>
        {asset.description ? (
          <p className="text-sm leading-relaxed text-[#9a9a9a]">{asset.description}</p>
        ) : null}
      </div>
      <p className="font-mono text-base text-[#d9d9d9]">Price: ${asset.price.toLocaleString()}</p>
      <SubmitButton />
      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-[#009966]">{state.success}</p> : null}
    </form>
  );
}
