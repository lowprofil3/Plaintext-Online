'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { ActionState } from '@/lib/actionState';

const INITIAL_STATE: ActionState = {};

interface WorkJobFormProps {
  jobs: Array<{
    id: string;
    title: string;
  }>;
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
      {pending ? 'Working…' : 'Work Job'}
    </button>
  );
}

export default function WorkJobForm({ jobs, action }: WorkJobFormProps) {
  const [state, formAction] = useFormState(action, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="job_id" className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]">
          Select Job
        </label>
        <select
          id="job_id"
          name="job_id"
          required
          className="w-full border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-[#d9d9d9] focus:border-[#009966] focus:outline-none"
        >
          <option value="">Choose a job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>
      <SubmitButton />
      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-[#009966]">{state.success}</p> : null}
    </form>
  );
}
