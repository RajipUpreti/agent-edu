"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateStudent } from "@/lib/api/students";
import { Student } from "@/features/students/types";

type StudentProfileTabsProps = {
  student: Student;
};

const tabItems = [
  { id: "personal", label: "Personal Info" },
  { id: "academic", label: "Academic History" },
  { id: "documents", label: "Documents" },
  { id: "applications", label: "Applications" },
  { id: "communication", label: "Communication Logs" },
];

export function StudentProfileTabs({ student }: StudentProfileTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "personal";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState({
    firstName: student.firstName,
    lastName: student.lastName ?? "",
    email: student.email ?? "",
    phone: student.phone ?? "",
    nationality: student.nationality ?? "",
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const updateQuery = (tab: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    router.replace(url.toString());
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    updateQuery(tabId);
  };

  const saveProfile = async () => {
    await updateStudent(student.id, {
      firstName: localProfile.firstName,
      lastName: localProfile.lastName,
      email: localProfile.email,
      phone: localProfile.phone,
      nationality: localProfile.nationality,
    });
    setIsEditing(false);
    router.refresh();
  };

  const content = useMemo(() => {
    switch (activeTab) {
      case "academic":
        return (
          <div className="space-y-2 text-sm">
            <p className="font-medium">Highest Qualification: </p>
            <p>{student.highestQualification ?? "Not provided"}</p>
            <p className="font-medium">Graduation Year: </p>
            <p>{student.graduationYear ?? "Not provided"}</p>
            <p className="font-medium">Current Occupation: </p>
            <p>{student.currentOccupation ?? "Not provided"}</p>
          </div>
        );
      case "documents":
        return (
          <div className="space-y-2 text-sm">
            <ul className="list-disc list-inside">
              <li>Passport Copy</li>
              <li>Academic Transcript</li>
              <li>Personal Statement</li>
              <li>Reference Letter</li>
            </ul>
            <p className="text-slate-500">Upload and manage documents in the student repository.</p>
          </div>
        );
      case "applications":
        return (
          <div className="space-y-2 text-sm">
            <p>3 currently active applications with universities as below:</p>
            <ul className="list-disc list-inside ml-4">
              <li>University of Manchester — MEng Aerospace Engineering</li>
              <li>University of Warwick — BSc Economics</li>
              <li>UCL — Architecture BSc</li>
            </ul>
          </div>
        );
      case "communication":
        return (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium">Recent activity</p>
              <Button size="sm" onClick={() => alert("Invite sent")}>Invite for call</Button>
            </div>
            <ul className="space-y-2">
              <li className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div className="flex items-center justify-between">
                  <span>2h ago</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Email</span>
                </div>
                <p className="text-sm text-slate-700">Email update sent about CAS status</p>
              </li>
              <li className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div className="flex items-center justify-between">
                  <span>Yesterday</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Review</span>
                </div>
                <p className="text-sm text-slate-700">Documents review completed</p>
              </li>
              <li className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div className="flex items-center justify-between">
                  <span>3 days ago</span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Call</span>
                </div>
                <p className="text-sm text-slate-700">Call with student to review visa timeline</p>
              </li>
            </ul>
          </div>
        );
      default:
        return (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Basic details</h4>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveProfile}>
                    Save
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name</span>
                {isEditing ? (
                  <input
                    value={localProfile.firstName}
                    onChange={(event) => setLocalProfile((prev) => ({ ...prev, firstName: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1"
                  />
                ) : (
                  <p className="text-sm text-slate-700">{student.firstName}</p>
                )}
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</span>
                {isEditing ? (
                  <input
                    value={localProfile.lastName}
                    onChange={(event) => setLocalProfile((prev) => ({ ...prev, lastName: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1"
                  />
                ) : (
                  <p className="text-sm text-slate-700">{student.lastName ?? "-"}</p>
                )}
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</span>
                {isEditing ? (
                  <input
                    value={localProfile.email}
                    onChange={(event) => setLocalProfile((prev) => ({ ...prev, email: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1"
                  />
                ) : (
                  <p className="text-sm text-slate-700">{student.email ?? "-"}</p>
                )}
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</span>
                {isEditing ? (
                  <input
                    value={localProfile.phone}
                    onChange={(event) => setLocalProfile((prev) => ({ ...prev, phone: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1"
                  />
                ) : (
                  <p className="text-sm text-slate-700">{student.phone ?? "-"}</p>
                )}
              </label>
              <label className="block md:col-span-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nationality</span>
                {isEditing ? (
                  <input
                    value={localProfile.nationality}
                    onChange={(event) => setLocalProfile((prev) => ({ ...prev, nationality: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1"
                  />
                ) : (
                  <p className="text-sm text-slate-700">{student.nationality ?? "-"}</p>
                )}
              </label>
            </div>
          </div>
        );
    }
  }, [activeTab, isEditing, localProfile, saveProfile, student]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-surface-container-low text-slate-600 hover:bg-surface-container-high"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          Update Info
        </Button>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
