"use server"

import { createExercise } from "@/data/exercises";
import { Tables } from "@/database.types";

export async function createExerciseAction(exercise: Omit<Tables<"exercises">, "id" | "created_at"> & { id?: number, created_at?: string | null }) {
  const { data, error } = await createExercise(exercise);
  return { data, error };
}
