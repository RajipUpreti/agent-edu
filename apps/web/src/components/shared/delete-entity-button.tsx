"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getApiBaseUrl } from "@/lib/api/config";

type DeleteEntityButtonProps = {
  resourceLabel: string;
  endpoint: string;
  redirectHref?: string;
  onDeleted?: () => void;
  confirmMessage?: string;
  variant?: "secondary" | "outline" | "ghost" | "danger";
  size?: "default" | "sm" | "lg";
};

export function DeleteEntityButton({
  resourceLabel,
  endpoint,
  redirectHref,
  onDeleted,
  confirmMessage,
  variant = "secondary",
  size = "default",
}: DeleteEntityButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    const message =
      confirmMessage ?? `Delete this ${resourceLabel.toLowerCase()}? This action cannot be undone.`;

    if (!window.confirm(message)) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          let details = "";

          try {
            const parsed = (await response.json()) as { message?: string };
            details = parsed.message ?? "";
          } catch {
            details = await response.text();
          }

          throw new Error(details || `Failed to delete ${resourceLabel.toLowerCase()}.`);
        }

        onDeleted?.();

        if (redirectHref) {
          router.push(redirectHref);
        }

        router.refresh();
      } catch (deleteError) {
        setError(deleteError instanceof Error ? deleteError.message : `Unable to delete ${resourceLabel.toLowerCase()}.`);
      }
    });
  };

  return (
    <div className="space-y-1.5">
      <Button type="button" variant={variant} size={size} disabled={isPending} onClick={onClick}>
        {isPending ? "Deleting..." : "Delete"}
      </Button>
      {error ? (
        <p className="rounded-lg border border-rose-300/60 bg-rose-50/82 px-2.5 py-1.5 text-xs text-rose-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}
