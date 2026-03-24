import Link from "next/link";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { StudentsList } from "@/features/students/components/students-list";
import { getStudents } from "@/lib/api/students";

type StudentsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const params = await searchParams;
  const search = readParam(params.search) ?? "";
  const sortBy = readParam(params.sortBy) ?? "createdAt";
  const sortOrder = readParam(params.sortOrder) ?? "desc";
  const page = Math.max(1, Number(readParam(params.page) ?? "1") || 1);
  const limit = 20;

  const result = await getStudents({
    search,
    sortBy: sortBy === "firstName" ? "firstName" : "createdAt",
    sortOrder: sortOrder === "asc" ? "asc" : "desc",
    page,
    limit,
  })
    .then((students) => ({ students, error: null }))
    .catch((error: unknown) => ({ students: null, error }));

  if (result.error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Students" description="Manage enrolled and prospective students." />
        <ErrorState
          description={
            result.error instanceof Error
              ? result.error.message
              : "Could not load students from the backend API."
          }
          actionLabel="Try Again"
          actionHref="/students"
        />
      </div>
    );
  }

  const students = result.students ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Track student records converted from contacts."
        actions={
          <Link href="/students/new" className="inline-flex">
            <Button>New Student</Button>
          </Link>
        }
      />
      <StudentsList
        students={students}
        query={{ search, sortBy, sortOrder, page, limit }}
      />
    </div>
  );
}
