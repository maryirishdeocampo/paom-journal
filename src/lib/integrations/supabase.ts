/**
 * Supabase client stub — wire up when backend is ready.
 *
 * 1. npm install @supabase/supabase-js
 * 2. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
 * 3. Uncomment the client below
 */

// import { createClient } from "@supabase/supabase-js";
//
// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

export async function getPublications() {
  // const { data, error } = await supabase.from("publications").select("*");
  // if (error) throw error;
  // return data;
  return [];
}
