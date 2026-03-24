"use client";

import { useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
};

const initialTasks: Task[] = [
  { id: "1", title: "App Review: James Lee", subtitle: "Due Today · High Priority", completed: false },
  { id: "2", title: "Call University of Toronto", subtitle: "Tomorrow · Follow-up", completed: true },
  { id: "3", title: "Email Monthly Newsletter", subtitle: "Completed", completed: true },
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const completionTimeouts = useMemo(() => new Map<string, number>(), []);

  useEffect(() => {
    return () => {
      completionTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [completionTimeouts]);

  const onToggle = (id: string) => {
    setTasks((prev) => {
      const next = prev.map((task) => {
        if (task.id !== id) return task;
        return { ...task, completed: !task.completed };
      });

      const toggled = next.find((task) => task.id === id);
      if (!toggled) return prev;

      if (toggled.completed) {
        const timeoutId = window.setTimeout(() => {
          setTasks((current) => current.filter((t) => t.id !== id));
          completionTimeouts.delete(id);
        }, 60_000);
        completionTimeouts.set(id, timeoutId);
      } else {
        const timeoutId = completionTimeouts.get(id);
        if (timeoutId) {
          window.clearTimeout(timeoutId);
          completionTimeouts.delete(id);
        }
      }

      return next;
    });
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500">No tasks remaining.</p>
      ) : (
        tasks.map((task) => (
          <label key={task.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-primary"
            />
            <div>
              <p className={`text-sm font-semibold ${task.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                {task.title}
              </p>
              <p className={`text-xs ${task.completed ? "text-slate-400" : "text-slate-500"}`}>{task.subtitle}</p>
            </div>
          </label>
        ))
      )}
    </div>
  );
}
