import { cookies } from 'next/headers';
import {
  createServerActionClient,
  createServerComponentClient,
  createRouteHandlerClient,
} from '@supabase/auth-helpers-nextjs';
import type { Database } from './database.types';

export function getServerComponentClient() {
  return createServerComponentClient<Database>({ cookies });
}

export function getServerActionClient() {
  return createServerActionClient<Database>({ cookies });
}

export function getRouteHandlerClient() {
  return createRouteHandlerClient<Database>({ cookies });
}
