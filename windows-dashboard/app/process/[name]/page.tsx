import Link from "next/link";
import { Suspense } from "react";
import PrefetchedProcessDetail from "../components/prefetched-process-detail";
import { ProcessDetailSkeleton } from "../components/process-detail-card";

export default function ProcessDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  return (
    <main className="min-h-screen p-10 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
            ← Back to Dashboard
          </Link>
        </div>

        <Suspense fallback={<ProcessDetailSkeleton />}>
          <PrefetchedProcessDetail params={params} />
        </Suspense>

      </div>
    </main>
  );
}
