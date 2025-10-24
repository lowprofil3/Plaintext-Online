import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const cachedClients: Record<string, SupabaseClient> = {};

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const SUPABASE_ENV_KEYS = {
  url: 'SUPABASE_URL',
  anonKey: 'SUPABASE_ANON_KEY',
} as const;

export function getSupabaseConfigFromEnv(): SupabaseConfig | null {
  const url = process.env[SUPABASE_ENV_KEYS.url];
  const anonKey = process.env[SUPABASE_ENV_KEYS.anonKey];

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfigFromEnv();

  if (!config) {
    return null;
  }

  const cacheKey = `${config.url}:${config.anonKey}`;
  if (!cachedClients[cacheKey]) {
    cachedClients[cacheKey] = createClient(config.url, config.anonKey);
  }

  return cachedClients[cacheKey];
}
