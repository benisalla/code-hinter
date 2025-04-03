import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, CheckCircle, ArrowRight, BarChart } from "lucide-react"
import Link from "next/link"
import { getTeacherExercises } from "@/data/exercises"
import { getTeacherSubmissionStats, getRecentTeacherSubmissions } from "@/data/submissions"
import { createClient } from "@/utils/supabase/server"
import { Tables } from "@/database.types"

export default async function TeacherDashboardPage() {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getSession();
  const userId = session.session?.user.id;
  
  let exercises: Tables<"exercises">[] = [];
  let submissionStats = { total: 0, graded: 0, ungraded: 0 };
  let recentSubmissions: Tables<"submissions">[] = [];
  let teacherName = "Teacher";
  
  if (userId) {
    // Get teacher profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();
      
    if (profileData?.full_name) {
      teacherName = profileData.full_name;
    }
    
    // Get exercises
    const { data: exercisesData } = await getTeacherExercises(userId);
    if (exercisesData) {
      exercises = exercisesData;
    }
    
    // Get submission stats
    const { data: statsData } = await getTeacherSubmissionStats(userId);
    if (statsData) {
      submissionStats = statsData;
    }
    
    // Get recent submissions
    const { data: submissionsData } = await getRecentTeacherSubmissions(userId, 3);
    if (submissionsData) {
      recentSubmissions = submissionsData;
    }
  }
  
  // Calculate completion rate
  const completionRate = submissionStats.total > 0 
    ? Math.round((submissionStats.graded / submissionStats.total) * 100) 
    : 0;
  
  // Calculate average score from graded submissions
  let averageScore = 0;
  if (recentSubmissions.length > 0) {
    const gradedSubmissions = recentSubmissions.filter(s => s.grade !== null);
    if (gradedSubmissions.length > 0) {
      const totalScore = gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0);
      averageScore = Math.round(totalScore / gradedSubmissions.length);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {teacherName}</h1>
        <p className="text-muted-foreground">Here's an overview of your classroom and student progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissionStats.total}</div>
            <p className="text-xs text-muted-foreground">{submissionStats.ungraded} pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exercises</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exercises.length}</div>
            <p className="text-xs text-muted-foreground">
              {exercises.length > 0 ? `${exercises.length} total exercises` : "No exercises yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">Graded submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">From graded submissions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Exercises</CardTitle>
            <CardDescription>Your recently created exercises.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exercises.length > 0 ? (
                exercises.slice(0, 3).map((exercise) => (
                  <div key={exercise.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{exercise.title}</p>
                      <p className="text-sm text-muted-foreground">{exercise.subject || "No subject"}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">{exercise.programming_language}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No exercises created yet.</p>
              )}
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link href="/dashboard/teacher/exercises">
                View all exercises
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Latest student submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.length > 0 ? (
                recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{(submission as any).profiles?.full_name || "Unknown Student"}</p>
                      <p className="text-sm text-muted-foreground">{(submission as any).exercises?.title || "Unknown Exercise"}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      {submission.grade !== null ? (
                        <span className="text-sm font-medium">{submission.grade}%</span>
                      ) : (
                        <span className="text-xs text-amber-500">Needs grading</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(submission.submitted_at || "").toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No submissions yet.</p>
              )}
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <Link href="/dashboard/teacher/submissions">
                View all submissions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

