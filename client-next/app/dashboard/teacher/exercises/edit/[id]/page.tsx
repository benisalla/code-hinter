import EditExerciseClient from "./_components/edit-exercise-client";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditExerciseClient exerciseId={parseInt(id)} />;
}
