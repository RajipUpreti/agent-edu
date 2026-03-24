import { notFound } from "next/navigation";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { StudentForm } from "@/features/students/components/student-form";
import { ApiError } from "@/lib/api/http";
import { getStudentById } from "@/lib/api/students";

type EditStudentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params;

  const result = await getStudentById(id)
    .then((student) => ({ student, error: null }))
    .catch((error: unknown) => ({ student: null, error }));

  if (result.error) {
    if (result.error instanceof ApiError && result.error.status === 404) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <PageHeader title="Edit Student" description="Update student details." />
        <ErrorState
          description={
            result.error instanceof Error
              ? result.error.message
              : "Could not load this student for editing."
          }
          actionLabel="Back to Students"
          actionHref="/students"
        />
      </div>
    );
  }

  const student = result.student;

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Student" description="Update profile and conversion details." />
      <StudentForm mode="edit" studentId={student.id} initialValues={student} />
    </div>
  );
}
