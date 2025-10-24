'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { ActionState } from '@/lib/actionState';

const INITIAL_STATE: ActionState = {};

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string | null;
    energy_cost: number;
    focus_cost: number;
    base_payout: number;
    reputation_required: number;
  };
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start border border-[#009966] bg-[#009966] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Processing…' : 'Work'}
    </button>
  );
}

export default function JobCard({ job, action }: JobCardProps) {
  const [state, formAction] = useFormState(action, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4 border border-[#2a2a2a] bg-[#151515] p-5">
      <input type="hidden" name="job_id" value={job.id} />
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d9d9d9]">{job.title}</h3>
        {job.description ? (
          <p className="mt-2 text-sm leading-relaxed text-[#9a9a9a]">{job.description}</p>
        ) : null}
      </div>
      <dl className="grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.25em] text-[#9a9a9a] sm:grid-cols-4">
        <div>
          <dt>Energy</dt>
          <dd className="mt-1 font-mono text-sm text-[#d9d9d9]">-{job.energy_cost}</dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd className="mt-1 font-mono text-sm text-[#d9d9d9]">-{job.focus_cost}</dd>
        </div>
        <div>
          <dt>Base Pay</dt>
          <dd className="mt-1 font-mono text-sm text-[#d9d9d9]">${job.base_payout}</dd>
        </div>
        <div>
          <dt>Reputation</dt>
          <dd className="mt-1 font-mono text-sm text-[#d9d9d9]">{job.reputation_required}</dd>
        </div>
      </dl>
      <SubmitButton />
      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-[#009966]">{state.success}</p> : null}
    </form>
  );
}
