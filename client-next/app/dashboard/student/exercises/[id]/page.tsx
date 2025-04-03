"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeEditor } from "@/components/code-editor"
import { Clock, Play, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"


// Simple markdown renderer function
function renderMarkdown(markdown: string) {
  // This is a very basic markdown renderer
  // In a real app, you would use a library like marked or remark

  // Process headings
  let html = markdown
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^#### (.*$)/gm, "<h4>$1</h4>")
    .replace(/^##### (.*$)/gm, "<h5>$1</h5>")
    .replace(/^###### (.*$)/gm, "<h6>$1</h6>")

  // Process bold and italic
  html = html
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")

  // Process lists
  html = html
    .replace(/^\s*\*\s(.*$)/gm, "<li>$1</li>")
    .replace(/^\s*-\s(.*$)/gm, "<li>$1</li>")
    .replace(/^\s*\d\.\s(.*$)/gm, "<li>$1</li>")

  // Wrap lists
  html = html
    .replace(/<li>.*?<\/li>(?=\n<li>)/g, (match) => {
      return "<ul>" + match
    })
    .replace(/<\/li>\n(?!<li>)/g, "</li></ul>\n")

  // Process code blocks
  html = html.replace(/```(.*?)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-muted p-2 rounded-md"><code>${code.trim()}</code></pre>`
  })

  // Process inline code
  html = html.replace(/`(.*?)`/g, "<code>$1</code>")

  // Process paragraphs (any line that's not already wrapped in HTML tags)
  html = html.replace(/^(?!<[a-z]).+/gm, (match) => {
    if (match.trim() === "") return ""
    return `<p>${match}</p>`
  })

  // Process line breaks
  html = html.replace(/\n\n/g, "<br/>")

  return html
}

export default function ExercisePage() {
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()
  
  const [exercise, setExercise] = useState<any>(null)
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submission, setSubmission] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null)
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<number | null>(null)

  useEffect(() => {
    async function fetchExercise() {
      try {
        setLoading(true)
        
        // Fetch the exercise data
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', parseInt(id))
          .single()
        
        if (exerciseError) throw exerciseError
        
        // Fetch any existing submission by the current student
        const { data: user } = await supabase.auth.getUser()
        
        if (user?.user?.id) {
          const { data: submissionData } = await supabase
            .from('submissions')
            .select('*')
            .eq('exercise_id', parseInt(id))
            .eq('student_id', user.user.id)
            .order('submitted_at', { ascending: false })
            .limit(1)
            .single()
          
          if (submissionData) {
            setSubmission(submissionData)
            setCode(submissionData.answer)
          } 
        }
        
        setExercise(exerciseData)
      } catch (err) {
        console.error(err)
        setError("Failed to load exercise")
      } finally {
        setLoading(false)
      }
    }
    
    fetchExercise()
  }, [id, supabase])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading exercise...</div>
  }

  if (error || !exercise) {
    return <div className="text-red-500">Error: {error || "Exercise not found"}</div>
  }

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running code...");
    
    try {
      const response = await fetch("http://localhost:5000/api/evaluate_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          concepts: exercise.instructions || "",
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setEvaluationResult(data.response);
      setIsDialogOpen(true);
      setOutput("Code evaluation complete. See results in the dialog.");
    } catch (error) {
      console.error("Error running code:", error);
      setOutput(`Error running code: ${(error as Error).message}`);
    } finally {
      setIsRunning(false);
    }
  }

  const saveProgress = async () => {
    setIsSaving(true)

    try {
      const { data: user } = await supabase.auth.getUser()
      
      if (!user?.user?.id) {
        throw new Error("You must be logged in to submit")
      }
      
      // First, compare the code with the professor's solution
      const response = await fetch("http://localhost:5000/api/compare_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code_prof: exercise.code || "",
          code_student: code,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error comparing code: ${response.status}`);
      }
      
      const data = await response.json();
      const score = data.response
      console.log(score)
      
      // Create submission data with the grade
      const submissionData = {
        exercise_id: parseInt(id),
        student_id: user.user.id,
        teacher_id: exercise.teacher_id,
        answer: code,
        submitted_at: new Date().toISOString(),
        grade: score,
        graded_at: new Date().toISOString(),
      }
      
      const { error } = await supabase
        .from('submissions')
        .upsert(submission ? { id: submission.id, ...submissionData } : submissionData)
      
      if (error) throw error
      
      // Update the local submission state to show the grade immediately
      setSubmission(submission ? { ...submission, ...submissionData } : submissionData)
      
      // Show the submission result dialog
      setSubmissionResult(score);
      setIsSubmissionDialogOpen(true);
      
      // Show success message
      setOutput(`Solution submitted successfully! Your score: ${score}/100`)
    } catch (error) {
      console.error(error)
      setOutput(`Error submitting solution: ${(error as Error).message}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Determine status based on submission
  const status = submission 
    ? (submission.grade !== null ? "completed" : "in-progress") 
    : "not-started"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/student/exercises"
            className="flex items-center text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Exercises
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{exercise.title}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-muted-foreground">{exercise.subject}</p>
            {exercise.created_at && (
              <>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Added {new Date(exercise.created_at).toLocaleDateString()}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <Badge
          className={
            status === "completed"
              ? "bg-green-500"
              : status === "in-progress"
                ? "bg-blue-500"
                : "bg-gray-500"
          }
        >
          {status === "completed"
            ? "Completed"
            : status === "in-progress"
              ? "In Progress"
              : "Not Started"}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(exercise.instructions || "") }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Solution</CardTitle>
          <CardDescription>
            Write your code in the editor below. You can run your code to test it before submitting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeEditor 
            language={exercise.programming_language || "javascript"} 
            value={code} 
            onChange={setCode} 
            height="300px" 
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={runCode} disabled={isRunning}>
            <Play className="mr-2 h-4 w-4" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>
          <Button onClick={saveProgress} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Submit Solution"}
          </Button>
        </CardFooter>
      </Card>

      {output && (
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto whitespace-pre-wrap">{output}</pre>
          </CardContent>
        </Card>
      )}

      {submission && submission.grade !== null && (
        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle>Graded Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">Grade: {submission.grade}/100</p>
            {submission.graded_at && (
              <p className="text-sm text-muted-foreground">
                Graded on {new Date(submission.graded_at).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Code Evaluation Result</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div 
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: evaluationResult ? renderMarkdown(evaluationResult) : "" }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submission Result</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {submissionResult !== null && (
              <>
                <div className="flex flex-col items-center justify-center p-6">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">{submissionResult}</span>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        className="text-muted stroke-current" 
                        strokeWidth="10" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                      />
                      <circle 
                        className="text-primary stroke-current" 
                        strokeWidth="10" 
                        strokeLinecap="round" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                        strokeDasharray={`${submissionResult * 2.51} 251`}
                        strokeDashoffset="0" 
                      />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold">
                    {submissionResult >= 90 ? "Excellent!" : 
                     submissionResult >= 70 ? "Good job!" : 
                     submissionResult >= 50 ? "Keep practicing!" : 
                     "You need more practice."}
                  </p>
                </div>
                <div className="text-center text-muted-foreground">
                  Your solution has been submitted and graded automatically.
                </div>
              </>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setIsSubmissionDialogOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

