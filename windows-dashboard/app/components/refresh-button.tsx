"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/query-keys";
import { useIsFetching } from "@tanstack/react-query";

export default function RefreshButton() {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: queryKeys.processes }) > 0;

  return (
    <Button
      onClick={() =>
        queryClient.invalidateQueries({ queryKey: queryKeys.processes })
      }
      disabled={isFetching}
    >
      {isFetching ? "Refreshing..." : "🔄 Refresh List"}
    </Button>
  );
}
