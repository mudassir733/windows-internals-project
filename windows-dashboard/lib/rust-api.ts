// Server-only helpers that talk directly to the Rust API.
// Used by the Next.js route handlers (app/api/*) and by server-side prefetching.
import type { ProcessDetail, ProcessItem } from "@/lib/types";

const baseUrl = () => process.env.RUST_API_BASE_URL || "http://127.0.0.1:3001";

export async function fetchProcessesFromRust(): Promise<ProcessItem[]> {
  const res = await fetch(`${baseUrl()}/api/processes`, { cache: "no-store" });
  if (!res.ok) throw new Error("Rust API se response nahi aya");
  return res.json();
}

export async function fetchProcessDetailFromRust(
  name: string
): Promise<ProcessDetail | null> {
  const res = await fetch(
    `${baseUrl()}/api/process/${encodeURIComponent(name)}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export async function deleteProcessInRust(pid: number): Promise<Response> {
  return fetch(`${baseUrl()}/api/process/${pid}`, {
    method: "DELETE",
    cache: "no-store",
  });
}
