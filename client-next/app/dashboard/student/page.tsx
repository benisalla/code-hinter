import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Award, ArrowRight } from "lucide-react"
import { getProfileById } from "@/data/profiles"
import { getStudentSubmissions } from "@/data/submissions"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export default async function StudentDashboardPage() {
  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Please log in to view your dashboard</div>
  }
  
  // Get profile data
  const { data: profile } = await getProfileById(user.id)
  
  // Get student submissions
  const { data: submissions } = await getStudentSubmissions(user.id)
  
  // Get assigned exercises (that may not have submissions yet)
  const { data: assignedExercises } = await supabase
    .from("exercises")
    .select("*")
    .order('created_at', { ascending: false })
  
  // Calculate stats
  const completedExercises = submissions?.length || 0
  
  // Calculate average score
  const gradedSubmissions = submissions?.filter(sub => sub.grade !== null) || []
  const averageScore = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((sum, sub) => sum + (sub.grade || 0), 0) / gradedSubmissions.length)
    : 0
  
  // Get upcoming exercises (those without submissions)
  const submittedExerciseIds = new Set(submissions?.map(sub => sub.exercise_id) || [])
  const upcomingExercises = assignedExercises?.filter(ex => !submittedExerciseIds.has(ex.id)) || []
  
  // Calculate progress by subject
  const subjectProgress: Record<string, {total: number, completed: number}> = {}
  
  assignedExercises?.forEach(exercise => {
    const subject = exercise.subject || 'Other'
    if (!subjectProgress[subject]) {
      subjectProgress[subject] = { total: 0, completed: 0 }
    }
    subjectProgress[subject].total++
    
    if (submittedExerciseIds.has(exercise.id)) {
      subjectProgress[subject].completed++
    }
  })
  
  const progressBySubject = Object.entries(subjectProgress).map(([subject, data]) => ({
    subject,
    progress: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name || 'Student'}</h1>
        <p className="text-muted-foreground">Here's an overview of your progress and upcoming exercises.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Exercises</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedExercises}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingExercises.length > 0 ? `${upcomingExercises.length} remaining` : 'All exercises completed'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              {gradedSubmissions.length} graded submissions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Due</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingExercises.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingExercises.length > 0 ? 'Exercises to complete' : 'No pending exercises'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Exercises</CardTitle>
            <CardDescription>Your recently assigned exercises.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExercises.slice(0, 3).map((exercise) => (
                <div key={exercise.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{exercise.title}</p>
                    <p className="text-sm text-muted-foreground">{exercise.subject || 'General'}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">{exercise.programming_language || 'Text'}</span>
                    <span className="text-xs text-muted-foreground">Not started</span>
                  </div>
                </div>
              ))}
              
              {upcomingExercises.length === 0 && (
                <div className="py-3 text-center text-muted-foreground">
                  No pending exercises
                </div>
              )}
            </div>
            <Link href="/exercises">
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                View all exercises
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your learning progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressBySubject.map((subject, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{subject.subject}</span>
                    <span className="text-sm font-medium">{subject.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${subject.progress}%` }} />
                  </div>
                </div>
              ))}
              
              {progressBySubject.length === 0 && (
                <div className="py-3 text-center text-muted-foreground">
                  No subject progress data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

