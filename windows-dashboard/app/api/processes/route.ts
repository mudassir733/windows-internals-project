import { NextResponse } from "next/server";
import { fetchProcessesFromRust } from "@/lib/rust-api";

export async function GET() {
  try {
    return NextResponse.json(await fetchProcessesFromRust());
  } catch {
    return NextResponse.json(
      { error: "Could not reach the Rust API server." },
      { status: 502 }
    );
  }
}
