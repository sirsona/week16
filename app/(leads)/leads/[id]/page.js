import pool from "@/lib/db";
import { notFound } from "next/navigation";

export default async function LeadDetailPage({ params }) {
  const { id } = await params;
  let lead;
  try {
    const { rows } = await pool.query("SELECT * FROM leads WHERE id = $1", [id]);
    lead = rows[0];
  } catch {
    notFound();
  }

  if (!lead || lead.error) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {lead.name || lead.wa_phone}
      </h1>

      <div className="mt-4 space-y-2 text-gray-700">
        <p>
          <span className="font-medium">Status:</span> {lead.status}
        </p>
        <p>
          <span className="font-medium">Source:</span>{" "}
          {lead.source || lead.channel || "—"}
        </p>
        <p>
          <span className="font-medium">Phone:</span> {lead.wa_phone}
        </p>
      </div>
    </main>
  );
}
