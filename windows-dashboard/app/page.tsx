import { Suspense } from "react";
import PrefetchedProcessTable from "./components/prefetched-process-table";
import { ProcessTableSkeleton } from "./components/process-table";
import RefreshButton from "./components/refresh-button";

export default function Home() {
  return (
    <main className="min-h-screen p-10 font-sans">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-blue-400">
              NovaMon Task Manager
            </h1>
            <p className="text-muted-foreground">
              Secure Server-Side Rendered (SSR) Dashboard
            </p>
          </div>

          <RefreshButton />
        </div>

        <Suspense fallback={<ProcessTableSkeleton />}>
          <PrefetchedProcessTable />
        </Suspense>

      </div>
    </main>
  );
}
