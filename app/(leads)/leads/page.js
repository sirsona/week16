import pool from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LeadsPage() {
  // Simulate slow query (remove after testing)
  await new Promise((r) => setTimeout(r, 1500));

 let leads = [];
  let error = null;

  try {
    const { rows } = await pool.query(
      "SELECT id, name, wa_phone, status, channel FROM leads ORDER BY created_at DESC LIMIT 50",
    );
    leads = rows;
  } catch (err) {
    console.warn("Could not fetch leads — database unreachable during build");
    error = "Unable to load leads at this time.";
  }

  if (error || !leads || leads.length === 0) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Leads</h1>
        <p className="text-gray-500 mt-6 text-center">
          {error || "No leads found."}
        </p>
      </main>
    );
  }
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Leads</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-medium border-b">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="block w-full h-full"
                  >
                    {lead.name || "—"}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="block w-full h-full"
                  >
                    {lead.wa_phone}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="block w-full h-full"
                  >
                    <span
                      className={`
                        inline-block px-2.5 py-1 text-xs font-semibold rounded-full
                        ${
                          lead.status === "new"
                            ? "bg-blue-100 text-blue-700"
                            : lead.status === "contacted"
                              ? "bg-orange-100 text-orange-700"
                              : lead.status === "converted"
                                ? "bg-green-100 text-green-700"
                                : lead.status === "lost"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                        }
                      `}
                    >
                      {lead.status}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="block w-full h-full"
                  >
                    {lead.channel || "—"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leads.length === 0 && (
        <p className="text-gray-500 mt-6 text-center">No leads found.</p>
      )}
    </main>
  );
}
