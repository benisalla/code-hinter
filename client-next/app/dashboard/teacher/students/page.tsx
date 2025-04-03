import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { getTeacherSubmissions } from "@/data/submissions"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

export default async function StudentsPage() {
  const supabase = await createClient()
  const { data: session } = await supabase.auth.getSession()
  const teacherId = session.session?.user.id
  
  let submissions = []
  let students = []
  
  if (teacherId) {
    // Fetch submissions for this teacher
    const { data: submissionsData, error } = await getTeacherSubmissions(teacherId)
    console.log("submissionsData: ", submissionsData);
    if (submissionsData && !error) {
      submissions = submissionsData
      
      // Create a map of students with their submission data
      const studentMap = new Map()
      
      submissionsData.forEach(submission => {
        if (submission.profiles) {
          const studentId = submission.profiles.id
          
          if (!studentMap.has(studentId)) {
            studentMap.set(studentId, {
              id: studentId,
              name: submission.profiles.full_name || "Unknown",
              submissions: 0,
              graded: 0,
              ungraded: 0,
              lastSubmission: null,
              totalScore: 0,
              maxPossibleScore: 0
            })
          }
          
          const student = studentMap.get(studentId)
          student.submissions += 1
          
          if (submission.grade !== null) {
            student.graded += 1
            student.totalScore += submission.grade || 0
            student.maxPossibleScore += 100
          } else {
            student.ungraded += 1
          }
          
          // Track the most recent submission
          if (!student.lastSubmission || new Date(submission.submitted_at || "") > new Date(student.lastSubmission)) {
            student.lastSubmission = submission.submitted_at
          }
        }
      })
      
      students = Array.from(studentMap.values())
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage your students and their submissions.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
          <CardDescription>View and manage student submissions for your exercises.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Total Submissions</TableHead>
                <TableHead>Graded</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        {student.submissions}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        {student.graded}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {student.ungraded > 0 ? (
                          <>
                            <XCircle className="mr-2 h-4 w-4 text-amber-500" />
                            <Badge variant="outline" className="bg-amber-100">
                              {student.ungraded}
                            </Badge>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            0
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.maxPossibleScore > 0 ? (
                        <Badge variant={student.totalScore/student.maxPossibleScore >= 0.7 ? "default" : "outline"}>
                          {student.totalScore}/{student.maxPossibleScore}
                        </Badge>
                      ) : (
                        "No score"
                      )}
                    </TableCell>
                    <TableCell>
                      {student.lastSubmission ? (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDistanceToNow(new Date(student.lastSubmission), { addSuffix: true })}
                        </div>
                      ) : (
                        "No submissions"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No student submissions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

