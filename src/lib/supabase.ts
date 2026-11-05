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
  video_url: string | null;
  sort_order: number;
  is_published: boolean;
};

export const GROUPS: Record<string, string> = {
  destinasi: "Destinasi",
  seni: "Seni & Budaya",
  kerajinan: "Kerajinan",
  kuliner: "Kuliner",
  festival: "Event & Festival",
};

export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : null;
}

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

export async function fetchSetting(key: string) {
  const { data, error } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
  if (error) {
    console.warn("Setting table might not exist yet:", error.message);
    return null;
  }
  return data?.value as string | null;
}
