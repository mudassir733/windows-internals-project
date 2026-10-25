import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchProcessDetailFromRust } from "@/lib/rust-api";
import { queryKeys } from "@/lib/query-keys";
import ProcessDetailCard from "./process-detail-card";

export default async function PrefetchedProcessDetail({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const processName = decodeURIComponent(name);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.processDetail(processName),
    queryFn: () => fetchProcessDetailFromRust(processName),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProcessDetailCard name={processName} />
    </HydrationBoundary>
  );
}
