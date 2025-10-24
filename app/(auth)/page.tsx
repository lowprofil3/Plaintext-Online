import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerActionClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import { AuthForm, type AuthState } from './AuthForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const signIn = async (_: AuthState, formData: FormData): Promise<AuthState> => {
  'use server';

  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = createServerActionClient<Database>({ cookies });
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
};

const signUp = async (_: AuthState, formData: FormData): Promise<AuthState> => {
  'use server';

  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();
  const username = formData.get('username')?.toString().trim();

  if (!email || !password || !username) {
    return { error: 'Email, password, and username are required.' };
  }

  const supabase = createServerActionClient<Database>({ cookies });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await supabase.rpc('init_player');
  }

  redirect('/dashboard');
};

export default async function LoginPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#9a9a9a]">PlainText Online</p>
        <h1 className="text-2xl font-semibold uppercase tracking-[0.35em] text-[#d9d9d9]">
          Simplicity is the interface
        </h1>
        <p className="text-sm leading-relaxed text-[#9a9a9a]">
          Sign in to access your operator dashboard or create a new account to begin building your presence in the city.
        </p>
      </div>

      <div className="space-y-8">
        <AuthForm
          title="Login"
          description="Access the city operations dashboard with your registered credentials."
          submitLabel="Sign In"
          action={signIn}
        >
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              className="w-full border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-[#d9d9d9] focus:border-[#009966] focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              className="w-full border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-[#d9d9d9] focus:border-[#009966] focus:outline-none"
            />
          </div>
        </AuthForm>

        <div className="h-px bg-[#2a2a2a]" aria-hidden />

        <AuthForm
          title="Create Account"
          description="Create a PlainText Online operator account. Your username identifies you across jobs, markets, and messages."
          submitLabel="Sign Up"
          action={signUp}
        >
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]" htmlFor="signup-username">
              Username
            </label>
            <input
              id="signup-username"
              name="username"
              required
              className="w-full border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-[#d9d9d9] focus:border-[#009966] focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              className="w-full border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-[#d9d9d9] focus:border-[#009966] focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-[#9a9a9a]" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              required
              className="w-full border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-[#d9d9d9] focus:border-[#009966] focus:outline-none"
            />
          </div>
        </AuthForm>
      </div>
    </div>
  );
}
