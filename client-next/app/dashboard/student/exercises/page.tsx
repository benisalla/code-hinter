import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { Tables } from "@/database.types"


export default async function StudentExercisesPage() {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getSession();
  const userId = session.session?.user.id;
  
  let exercises: Tables<"exercises">[] = [];
  if (userId) {
    // Fetch exercises assigned to this student
    // Note: You may need to create a getStudentExercises function in data/exercises.ts
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      
    if (data && !error) {
      exercises = data;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
        <p className="text-muted-foreground">View and complete your assigned exercises.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exercises.length > 0 ? (
          exercises.map((exercise) => {
            
            return (
              <Card key={exercise.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{exercise.title}</CardTitle>
                      <CardDescription>{exercise.subject}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">{exercise.instructions}</p>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Language: {exercise.programming_language}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/student/exercises/${exercise.id}`}>
                      Start Exercise
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No exercises assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

