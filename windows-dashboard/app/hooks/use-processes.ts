"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { ProcessItem } from "@/lib/types";

export async function getProcesses(): Promise<ProcessItem[]> {
  const res = await fetch("/api/processes");
  if (!res.ok) throw new Error("Could not load processes");
  return res.json();
}

export function useProcesses() {
  return useQuery({
    queryKey: queryKeys.processes,
    queryFn: getProcesses,
  });
}
