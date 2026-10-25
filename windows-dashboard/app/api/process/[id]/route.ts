import { NextResponse } from "next/server";
import { deleteProcessInRust, fetchProcessDetailFromRust } from "@/lib/rust-api";


export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const details = await fetchProcessDetailFromRust(decodeURIComponent(id));
    if (!details) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(details);
  } catch {
    return NextResponse.json(
      { error: "Could not reach the Rust API server." },
      { status: 502 }
    );
  }
}

// DELETE /api/process/:pid  
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pid = Number(id);
  if (!Number.isInteger(pid)) {
    return NextResponse.json({ error: "Invalid PID" }, { status: 400 });
  }
  try {
    const res = await deleteProcessInRust(pid);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: text || `Failed to delete process ${pid}` },
        { status: res.status }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the Rust API server." },
      { status: 502 }
    );
  }
}
