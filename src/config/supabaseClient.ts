import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv, SupabaseEnvConfig } from './env';

const cachedClients: Record<string, SupabaseClient> = {};

export function getSupabaseConfigFromEnv(): SupabaseEnvConfig | null {
  return getSupabaseEnv();
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

export function clearSupabaseClientCache() {
  for (const key of Object.keys(cachedClients)) {
    delete cachedClients[key];
  }
}
