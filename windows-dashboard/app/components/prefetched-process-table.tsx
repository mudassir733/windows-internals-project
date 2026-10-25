import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchProcessesFromRust } from "@/lib/rust-api";
import { queryKeys } from "@/lib/query-keys";
import ProcessTable from "./process-table";

// Server component: prefetches into a QueryClient and hands the cache to the
// browser so the first render already has data (React Query takes over after).
export default async function PrefetchedProcessTable() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.processes,
    queryFn: fetchProcessesFromRust,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProcessTable />
    </HydrationBoundary>
  );
}
