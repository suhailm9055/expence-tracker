export function getSupabaseCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  console.log("SUPABASE URL:", url);
  console.log("SUPABASE KEY:", key);

  return {
    url: url!,
    key: key!,
  };
}