import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const rawEnv = {
  SUPABASE_URL: process.env.SUPABASE_URL || undefined,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || undefined,
};

const envSchema = z.object({
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

type RawEnv = z.infer<typeof envSchema>;

const parsedEnv = envSchema.safeParse(rawEnv);

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.flatten().fieldErrors;
  throw new Error(
    `Invalid environment configuration. Check SUPABASE_* variables. Details: ${JSON.stringify(
      formattedErrors,
    )}`,
  );
}

const env = parsedEnv.data as RawEnv;

export interface SupabaseEnvConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseEnv(): SupabaseEnvConfig | null {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return null;
  }

  return {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
  };
}

export function requireSupabaseEnv(): SupabaseEnvConfig {
  const config = getSupabaseEnv();
  if (!config) {
    throw new Error(
      'Supabase credentials are missing. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your environment.',
    );
  }

  return config;
}
