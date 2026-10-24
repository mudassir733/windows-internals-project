import { revalidatePath } from "next/cache";

// TypeScript Interface
interface ProcessItem {
  pid: number;
  name: string;
}

// 1. Server-Side Fetch Function
async function fetchProcesses(): Promise<ProcessItem[]> {
  try {

    const baseUrl = process.env.RUST_API_BASE_URL || "http://127.0.0.1:3001";

    const res = await fetch(`${baseUrl}/api/processes`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Rust API se response nahi aya");
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}


export default async function Home() {
  const processes = await fetchProcesses();


  async function refreshData() {
    "use server";
    revalidatePath("/");
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-blue-400">
              NovaMon Task Manager
            </h1>
            <p className="text-gray-400">
              Secure Server-Side Rendered (SSR) Dashboard
            </p>
          </div>

          <form action={refreshData}>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow transition-colors"
            >
              🔄 Refresh List
            </button>
          </form>
        </div>

        {processes.length === 0 ? (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded">
            Error: Rust API Server se connect nahi ho paya. Make sure Rust server is running.
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
            <table className="w-full text-left">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="p-4 border-b border-gray-600">PID</th>
                  <th className="p-4 border-b border-gray-600">Process Name</th>
                  <th className="p-4 border-b border-gray-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((p) => (
                  <tr key={p.pid} className="hover:bg-gray-750 border-b border-gray-700/50 transition-colors">
                    <td className="p-4 text-blue-300 font-mono">{p.pid}</td>
                    <td className="p-4">{p.name}</td>
                    <td className="p-4 text-right">

                      <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  );
}