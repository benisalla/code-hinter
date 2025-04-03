"server only";

import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function createExercise(exercise: Omit<Tables<"exercises">, "id" | "created_at"> & { id?: number, created_at?: string | null }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .insert(exercise)
    .select("*")
    .single();

  return { data, error };
}

export async function getTeacherExercises(teacherId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("teacher_id", teacherId);

  return { data, error };
}

export async function getExerciseById(exerciseId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", exerciseId)
    .single();

  return { data, error };
}

export async function updateExercise(exerciseId: number, exercise: Partial<Tables<"exercises">>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .update(exercise)
    .eq("id", exerciseId)
    .select("*")
    .single();

  return { data, error };
}