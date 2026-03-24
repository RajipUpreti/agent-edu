"use client";

import { useEffect, useMemo, useState } from "react";
import { Application, PRIORITIES } from "@/features/applications/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

type ApplicationsPipelineProps = {
  initialApplications: Application[];
};

const COLUMN_DEFINITIONS = {
  Draft: ["DRAFT", "IN_PROGRESS"],
  Submitted: ["SUBMITTED"],
  "Under Review": ["OFFER_RECEIVED", "OFFER_ACCEPTED", "OFFER_REJECTED", "TUITION_PENDING", "COE_PENDING"],
  "Offer Received": ["COE_RECEIVED", "VISA_IN_PROGRESS"],
  "Visa Stage": ["VISA_GRANTED", "VISA_REJECTED", "ENROLLED", "CLOSED"],
} as const;

const getCardStatus = (status: Application["status"]): string => {
  switch (status) {
    case "DRAFT":
    case "IN_PROGRESS":
      return "Draft";
    case "SUBMITTED":
      return "Submitted";
    case "OFFER_RECEIVED":
    case "OFFER_ACCEPTED":
    case "OFFER_REJECTED":
    case "TUITION_PENDING":
    case "COE_PENDING":
      return "Under Review";
    case "COE_RECEIVED":
    case "VISA_IN_PROGRESS":
      return "Offer Received";
    default:
      return "Visa Stage";
  }
};

function buildColumns(items: Application[]) {
  const columns: Record<string, Application[]> = {};

  for (const bucket of Object.keys(COLUMN_DEFINITIONS)) {
    columns[bucket] = [];
  }

  items.forEach((item) => {
    const bucket = getCardStatus(item.status as Application["status"]);
    columns[bucket] = columns[bucket] ? [...columns[bucket], item] : [item];
  });

  return columns;
}

export function ApplicationsPipeline({ initialApplications }: ApplicationsPipelineProps) {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<Record<string, Application[]>>(buildColumns(initialApplications));
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [editPriorityAppId, setEditPriorityAppId] = useState<string | null>(null);
  const [editedPriority, setEditedPriority] = useState<Application["priority"]>("LOW");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 580);

    return () => window.clearTimeout(timer);
  }, []);

  const totalApps = initialApplications.length;
  const pendingCount = columns["Draft"].length + columns["Submitted"].length + columns["Under Review"].length;
  const acceptedCount = columns["Offer Received"].length + columns["Visa Stage"].length;

  const stageProgress = useMemo(() => {
    const map: Record<string, number> = {};
    Object.entries(columns).forEach(([label, list]) => {
      map[label] = totalApps > 0 ? Math.round((list.length / totalApps) * 100) : 0;
    });
    return map;
  }, [columns, totalApps]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceList = [...columns[source.droppableId]];
    const [moved] = sourceList.splice(source.index, 1);

    const destinationList = [...columns[destination.droppableId]];
    destinationList.splice(destination.index, 0, moved);

    setColumns((prev) => ({
      ...prev,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    }));
  };

  const startPriorityEdit = (application: Application) => {
    setEditPriorityAppId(application.id);
    setEditedPriority(application.priority);
  };

  const savePriorityEdit = () => {
    if (!editPriorityAppId) return;

    setColumns((prevColumns) => {
      const updatedColumns: Record<string, Application[]> = {};

      Object.entries(prevColumns).forEach(([column, list]) => {
        updatedColumns[column] = list.map((item) =>
          item.id === editPriorityAppId ? { ...item, priority: editedPriority } : item,
        );
      });

      return updatedColumns;
    });

    setEditPriorityAppId(null);
  };

  const cancelPriorityEdit = () => {
    setEditPriorityAppId(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-56 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-sm border border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Total pipeline</p>
            <p className="text-3xl font-bold text-slate-900">{totalApps}</p>
          </CardContent>
        </Card>
        <Card className="text-sm border border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Pending</p>
            <p className="text-3xl font-bold text-amber-700">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card className="text-sm border border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Accepted</p>
            <p className="text-3xl font-bold text-emerald-700">{acceptedCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
        <div className="text-sm text-slate-600">View mode</div>
        <div className="flex items-center gap-2">
          <button
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              viewMode === "kanban"
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            )}
            onClick={() => setViewMode("kanban")}
          >
            Kanban
          </button>
          <button
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              viewMode === "list"
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            )}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-5">
          {Object.keys(COLUMN_DEFINITIONS).map((column) => {
            const items = columns[column] ?? [];
            return (
              <Card key={column} className="border border-slate-200 bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{column}</h3>
                  <span className="text-xs font-bold text-slate-700">{items.length}</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${stageProgress[column] ?? 0}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{stageProgress[column] ?? 0}%</p>
              </CardHeader>
              <CardContent className="p-0">
                <Droppable droppableId={column}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2 p-2 min-h-[160px]"
                    >
                      {items.map((application, index) => (
                        <Draggable key={application.id} draggableId={application.id} index={index}>
                          {(providedDraggable) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              {...providedDraggable.dragHandleProps}
                              className="bg-surface-container-lowest rounded-lg border border-slate-200 p-3 text-xs shadow-sm cursor-pointer"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <strong className="text-sm text-slate-900 truncate">{application.institution?.name ?? application.institutionId}</strong>
                                {editPriorityAppId === application.id ? (
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={editedPriority}
                                      onChange={(event) => setEditedPriority(event.target.value as Application["priority"])}
                                      onBlur={savePriorityEdit}
                                      className="rounded border border-slate-300 bg-white px-1 py-0.5 text-[10px]"
                                    >
                                      {PRIORITIES.map((priority) => (
                                        <option key={priority} value={priority} className="text-xs">
                                          {priority}
                                        </option>
                                      ))}
                                    </select>
                                    <button
                                      className="text-[10px] font-semibold text-blue-600"
                                      onMouseDown={(event) => event.preventDefault()}
                                      onClick={savePriorityEdit}
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="text-[10px] font-semibold text-slate-500"
                                      onMouseDown={(event) => event.preventDefault()}
                                      onClick={cancelPriorityEdit}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    className="text-[10px] text-slate-500 hover:text-blue-600"
                                    onClick={() => startPriorityEdit(application)}
                                  >
                                    {application.priority}
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-slate-600">{application.student ? `${application.student.firstName} ${application.student.lastName ?? ""}` : application.studentId}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{application.applicationNumber ?? application.id.slice(0, 8)}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          );
        })}
      </div>
      </DragDropContext>
    ) : (
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Institution</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Application #</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(columns)
              .flat()
              .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
              .map((application) => (
                <tr key={application.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-2">{application.institution?.name ?? application.institutionId}</td>
                  <td className="px-4 py-2">{application.student ? `${application.student.firstName} ${application.student.lastName ?? ""}` : application.studentId}</td>
                  <td className="px-4 py-2">{application.status}</td>
                  <td className="px-4 py-2">{application.priority}</td>
                  <td className="px-4 py-2">{application.applicationNumber ?? application.id.slice(0, 8)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  );
}
