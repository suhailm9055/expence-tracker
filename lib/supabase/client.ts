import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseCredentials } from "./config";

// Client-side Supabase client. Uses the public anon key only.
// RLS policies (see supabase/migrations) guarantee this key can never
// read or write another user's rows, so it is safe to expose in the browser.
export function createClient() {
  const { url, key } = getSupabaseCredentials();
  return createBrowserClient(url, key);
}
