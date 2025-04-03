"use server"

import { updateExercise, getExerciseById } from "@/data/exercises";
import { Tables } from "@/database.types";

export async function updateExerciseAction(
  exerciseId: number,
  exercise: Partial<Tables<"exercises">>
) {
  const { data, error } = await updateExercise(exerciseId, exercise);
  return { data, error };
}

export async function getExerciseAction(exerciseId: number) {
  const { data, error } = await getExerciseById(exerciseId);
  return { data, error };
}