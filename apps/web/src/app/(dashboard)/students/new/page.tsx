import { PageHeader } from "@/components/shared/page-header";
import { StudentForm } from "@/features/students/components/student-form";

export default function NewStudentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Student"
        description="Create a student profile and link it to an existing contact."
      />
      <StudentForm mode="create" />
    </div>
  );
}
