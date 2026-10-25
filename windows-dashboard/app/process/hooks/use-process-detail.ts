"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { ProcessDetail } from "@/lib/types";

export async function getProcessDetail(
  name: string
): Promise<ProcessDetail | null> {
  const res = await fetch(`/api/process/${encodeURIComponent(name)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Could not load process details");
  return res.json();
}

export function useProcessDetail(name: string) {
  return useQuery({
    queryKey: queryKeys.processDetail(name),
    queryFn: () => getProcessDetail(name),
  });
}
