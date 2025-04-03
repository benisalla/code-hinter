import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FilePlus, CheckCircle, Clock } from "lucide-react"
import { getTeacherExercises } from "@/data/exercises"
import { getTeacherSubmissionStats, getDetailedSubmissionsByExerciseId } from "@/data/submissions"
import { createClient } from "@/utils/supabase/server"
import { Tables } from "@/database.types"

export default async function TeacherExercisesPage() {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getSession();
  const userId = session.session?.user.id;
  
  let exercises: Tables<"exercises">[] = [];
  let submissionStats = { total: 0, graded: 0, ungraded: 0 };
  let exerciseSubmissionCounts: Record<number, { total: number, graded: number }> = {};

  if (userId) {
    // Get exercises
    const { data, error } = await getTeacherExercises(userId);
    if (data && !error) {
      exercises = data;
      
      // Get overall submission stats
      const statsResult = await getTeacherSubmissionStats(userId);
      if (statsResult.data) {
        submissionStats = statsResult.data;
      }
      
      // Get submission counts for each exercise
      for (const exercise of exercises) {
        if (exercise.id) {
          const { data: submissionData } = await getDetailedSubmissionsByExerciseId(exercise.id);
          if (submissionData) {
            const total = submissionData.length;
            const graded = submissionData.filter(s => s.grade !== null).length;
            exerciseSubmissionCounts[exercise.id] = { total, graded };
          }
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
          <p className="text-muted-foreground">Manage and track student exercises.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/teacher/exercises/new">
            <FilePlus className="mr-2 h-4 w-4" />
            New Exercise
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissionStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Graded</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <div className="text-2xl font-bold">{submissionStats.graded}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock className="h-4 w-4 text-amber-500 mr-2" />
            <div className="text-2xl font-bold">{submissionStats.ungraded}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <Card key={exercise.id}>
              <CardHeader>
                <CardTitle>{exercise.title}</CardTitle>
                <CardDescription>{exercise.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2">{exercise.instructions}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">Language: {exercise.programming_language}</span>
                  
                  {exercise.id && exerciseSubmissionCounts[exercise.id] && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Submissions:</span> 
                      <span>{exerciseSubmissionCounts[exercise.id].total}</span>
                      <span className="text-green-500 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {exerciseSubmissionCounts[exercise.id].graded}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/teacher/exercises/edit/${exercise.id}`}>
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/teacher/exercises/${exercise.id}/submissions`}>
                      View Results
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No exercises found. Create your first exercise!</p>
          </div>
        )}
      </div>
    </div>
  )
}

