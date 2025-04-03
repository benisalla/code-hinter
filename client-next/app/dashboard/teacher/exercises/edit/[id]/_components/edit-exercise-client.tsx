"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CodeEditor } from "@/components/code-editor";
import { Save } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getExerciseAction, updateExerciseAction } from "@/app/dashboard/teacher/exercises/edit/[id]/actions";


// Define the form schema with Zod
const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subject: z.string().min(1, "Subject is required"),
    instructions: z.string().min(1, "Instructions are required"),
    programming_language: z.string().min(1, "Programming language is required"),
    code: z.string().min(1, "Code is required"),
  });

export default function EditExerciseClient({ exerciseId }: { exerciseId: number }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    // Define form with React Hook Form and Zod validation
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        subject: "",
        instructions: "",
        programming_language: "javascript",
        code: "",
      },
    });
  
    useEffect(() => {
      async function loadExercise() {
        setIsLoading(true);
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            router.push("/login");
            return;
          }
  
          const { data, error } = await getExerciseAction(exerciseId);
          
          if (error) {
            toast({
              title: "Error loading exercise",
              description: error.message,
              variant: "destructive",
            });
            return;
          }
  
          if (data) {
            // Make sure the teacher owns this exercise
            if (data.teacher_id !== user.id) {
              toast({
                title: "Unauthorized",
                description: "You don't have permission to edit this exercise",
                variant: "destructive",
              });
              router.push("/dashboard/teacher/exercises");
              return;
            }
  
            form.reset({
              title: data.title || "",
              subject: data.subject || "",
              instructions: data.instructions || "",
              programming_language: data.programming_language || "javascript",
              code: data.code || "",
            });
          }
        } catch (error) {
          toast({
            title: "Error loading exercise",
            description: "There was an error loading the exercise. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
  
      loadExercise();
    }, [exerciseId, form, router, toast]);
  
    const programmingLanguages = [
      { value: "javascript", label: "JavaScript" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "csharp", label: "C#" },
      { value: "cpp", label: "C++" },
      { value: "ruby", label: "Ruby" },
    ];
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      setIsSubmitting(true);
  
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
  
        if (!user) {
          toast({
            title: "Error updating exercise",
            description:
              "There was an error updating your exercise. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        const { data, error } = await updateExerciseAction(
          exerciseId,
          {
            title: values.title,
            subject: values.subject,
            instructions: values.instructions,
            programming_language: values.programming_language,
            code: values.code,
          }
        );
  
        if (error) {
          toast({
            title: "Error updating exercise",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Exercise updated",
            description: "Your exercise has been updated successfully",
          });
          router.push("/dashboard/teacher/exercises");
        }
      } catch (error) {
        toast({
          title: "Something went wrong",
          description:
            "There was an error updating your exercise. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-muted-foreground">Loading exercise...</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Exercise
          </h1>
          <p className="text-muted-foreground">
            Update your coding exercise.
          </p>
        </div>
  
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Details</CardTitle>
                <CardDescription>
                  Basic information about the exercise.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a descriptive title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
  
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
  
            <Card>
              <CardHeader>
                <CardTitle>Exercise Instructions</CardTitle>
                <CardDescription>
                  Provide detailed instructions for the exercise.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RichTextEditor 
                          value={field.value} 
                          onChange={(value) => {
                            field.onChange(value);
                          }} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
  
            <Card>
              <CardHeader>
                <CardTitle>Code Editor</CardTitle>
                <CardDescription>
                  Provide starter code or examples for the exercise.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="programming_language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Programming Language</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programmingLanguages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
  
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Code</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          {form.watch("programming_language")}
                        </div>
                      </div>
                      <FormControl>
                        <CodeEditor
                          language={form.watch("programming_language")}
                          value={field.value}
                          onChange={field.onChange}
                          height="300px"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
  
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Updating..." : "Update Exercise"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }