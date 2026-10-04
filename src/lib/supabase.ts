import { createClient } from "@supabase/supabase-js";

// Publishable key is safe to ship in the browser; RLS protects the data.
export const supabase = createClient(
  "https://tcmjodqyalbonhcddkxy.supabase.co",
  "sb_publishable_Wx9Eigxb3lOESpgkMdUMSA_W02AcCx2",
  { auth: { persistSession: typeof window !== "undefined" } },
);

export type Destination = {
  id: string;
  slug: string;
  name: string;
  group_type: string;
  category: string;
  short_description: string | null;
  description: string | null;
  address: string | null;
  maps_url: string | null;
  opening_hours: string | null;
  price: string | null;
  contact: string | null;
  instagram: string | null;
  photo_url: string | null;
  sort_order: number;
  is_published: boolean;
};

export const GROUPS: Record<string, string> = {
  destinasi: "Destinasi",
  seni: "Seni & Budaya",
  kerajinan: "Kerajinan",
  kuliner: "Kuliner",
};

export async function fetchDestinations(all = false) {
  let q = supabase.from("destinations").select("*").order("sort_order");
  if (!all) q = q.eq("is_published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Destination[];
}

export async function fetchDestination(slug: string) {
  const { data, error } = await supabase.from("destinations").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as Destination | null;
}
