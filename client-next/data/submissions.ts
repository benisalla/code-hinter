"server only";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database.types";

export type SubmissionWithStudentInfo = Tables<"submissions"> & {
  profiles: Tables<"profiles"> | null;
  exercises: Tables<"exercises"> | null;
};

/**
 * Get all submissions for a specific exercise
 */
export async function getSubmissionsByExerciseId(exerciseId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("*, profiles(*), exercises(*)")
    .eq("exercise_id", exerciseId);

  return { data, error };
}

/**
 * Get all submissions for a teacher
 */
export async function getTeacherSubmissions(teacherId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select(`
      *,
      profiles:student_id(id, full_name, role),
      exercises:exercise_id(id, title, subject, programming_language)
    `)
    .eq("teacher_id", teacherId)
    .order("submitted_at", { ascending: false });

  return { data: data as SubmissionWithStudentInfo[] | null, error };
}

/**
 * Get detailed submissions for a specific exercise with student information
 */
export async function getDetailedSubmissionsByExerciseId(exerciseId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select(
      `
      *,
      profiles:student_id(id, full_name, role),
      exercises:exercise_id(id, title, subject, programming_language)
    `
    )
    .eq("exercise_id", exerciseId)
    .order("submitted_at", { ascending: false });

  return { data: data as SubmissionWithStudentInfo[] | null, error };
}

/**
 * Get a specific submission by ID with related information
 */
export async function getSubmissionById(submissionId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select(
      `
      *,
      profiles:student_id(id, full_name, role),
      exercises:exercise_id(id, title, subject, programming_language)
    `
    )
    .eq("id", submissionId)
    .single();

  return { data: data as SubmissionWithStudentInfo | null, error };
}

/**
 * Get all submissions for a specific student
 */
export async function getStudentSubmissions(studentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select(
      `
      *,
      exercises:exercise_id(id, title, subject, programming_language)
    `
    )
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false });

  return { data, error };
}

/**
 * Update a submission's grade
 */
export async function updateSubmissionGrade(
  submissionId: number,
  grade: number
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .update({
      grade: grade,
      graded_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .select();

  return { data, error };
}

/**
 * Get submission statistics for a teacher
 * Returns counts of graded and ungraded submissions
 */
export async function getTeacherSubmissionStats(teacherId: string) {
  const supabase = await createClient();

  // Get total submissions
  const { data: totalData, error: totalError } = await supabase
    .from("submissions")
    .select("id", { count: "exact" })
    .eq("teacher_id", teacherId);

  // Get graded submissions
  const { data: gradedData, error: gradedError } = await supabase
    .from("submissions")
    .select("id", { count: "exact" })
    .eq("teacher_id", teacherId)
    .not("grade", "is", null);

  if (totalError || gradedError) {
    return {
      data: null,
      error: totalError || gradedError,
    };
  }

  const total = totalData?.length || 0;
  const graded = gradedData?.length || 0;

  return {
    data: {
      total,
      graded,
      ungraded: total - graded,
    },
    error: null,
  };
}

/**
 * Get recent submissions for a teacher
 * Useful for dashboard displays
 */
export async function getRecentTeacherSubmissions(
  teacherId: string,
  limit: number = 5
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select(
      `
      *,
      profiles:student_id(id, full_name),
      exercises:exercise_id(id, title)
    `
    )
    .eq("teacher_id", teacherId)
    .order("submitted_at", { ascending: false })
    .limit(limit);

  return { data: data as SubmissionWithStudentInfo[] | null, error };
}
