"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";

async function deleteProcess(pid: number): Promise<void> {
  const res = await fetch(`/api/process/${pid}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Failed to delete process ${pid}`);
  }
}

export function useDeleteProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pid }: { pid: number; name: string }) => deleteProcess(pid),
    onSuccess: (_data, { pid, name }) => {
      toast.success(`Process ${name} (PID ${pid}) deleted`);
      queryClient.invalidateQueries({ queryKey: queryKeys.processes });
      queryClient.removeQueries({ queryKey: queryKeys.processDetail(name) });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
