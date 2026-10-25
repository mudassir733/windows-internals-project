"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProcesses } from "@/app/hooks/use-processes";
import DeleteProcessButton from "./delete-process-button";

export function ProcessTableSkeleton() {
  return (
    <div className="rounded-lg border">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b last:border-b-0">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-7 w-32" />
        </div>
      ))}
    </div>
  );
}

export default function ProcessTable() {
  const { data: processes, isPending, isError } = useProcesses();

  if (isPending) return <ProcessTableSkeleton />;

  if (isError || processes.length === 0) {
    return (
      <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded">
        Error: Rust API Server se connect nahi ho paya. Make sure Rust server is running.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PID</TableHead>
            <TableHead>Process Name</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((p) => (
            <TableRow key={p.pid}>
              <TableCell>
                <Badge variant="secondary" className="font-mono">
                  {p.pid}
                </Badge>
              </TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    render={
                      <Link href={`/process/${encodeURIComponent(p.name)}`} />
                    }
                    nativeButton={false}
                  >
                    Details
                  </Button>
                  <DeleteProcessButton pid={p.pid} name={p.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
