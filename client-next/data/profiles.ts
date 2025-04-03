"server only";

import { createClient } from "@/utils/supabase/server";

export async function getProfileById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();


  return { data, error };
    
}