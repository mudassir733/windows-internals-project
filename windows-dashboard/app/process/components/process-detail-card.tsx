"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import DeleteProcessButton from "@/app/components/delete-process-button";
import { useProcessDetail } from "@/app/process/hooks/use-process-detail";

export function ProcessDetailSkeleton() {
  return (
    <div className="rounded-lg border p-8 space-y-4">
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export default function ProcessDetailCard({ name }: { name: string }) {
  const { data: details, isPending } = useProcessDetail(name);

  if (isPending) return <ProcessDetailSkeleton />;

  if (!details) {
    return (
      <div className="bg-red-900/50 border border-red-500 text-red-200 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-2">Access Denied or Not Found</h2>
        <p>
          We cannont get the <b>{name}</b> From the window maybe it is a core process of window that need permission.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-8">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">{details.name}</h1>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 rounded border">
          <span className="text-muted-foreground">Process ID (PID)</span>
          <Badge variant="secondary" className="font-mono">
            {details.pid}
          </Badge>
        </div>

        <div className="flex justify-between p-4 rounded border">
          <span className="text-muted-foreground">RAM Usage</span>
          <span className="font-bold text-green-400">{details.ram_usage_mb} MB</span>
        </div>

        <div className="p-4 rounded border">
          <span className="text-muted-foreground block mb-2">Executable Path</span>
          <code className="text-sm text-yellow-300 break-all">{details.path}</code>
        </div>

        <div className="flex justify-end pt-2">
          <DeleteProcessButton
            pid={details.pid}
            name={details.name}
            redirectTo="/"
          />
        </div>
      </div>
    </div>
  );
}
