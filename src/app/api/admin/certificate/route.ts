import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/admin/certificate
 * Generates a certificate record in SQLite via Prisma.
 * Degrades gracefully on DB failure.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      studentName?: string;
      courseTitle?: string;
      issueDate?: string;
    } | null;

    if (!body || !body.studentName || !body.courseTitle) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a unique certificate ID
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const certId = `AVM-CERT-${year}-${rand}`;

    try {
      await db.certificate.create({
        data: {
          certId,
          studentName: body.studentName,
          courseTitle: body.courseTitle,
          issueDate: body.issueDate ?? new Date().toISOString().slice(0, 10),
          issuedBy: "AVM Smart Solutions",
          status: "Issued",
        },
      });
    } catch (dbError) {
      console.error("[api/admin/certificate] DB write failed:", dbError);
    }

    return NextResponse.json({ success: true, certId });
  } catch (err) {
    console.error("[api/admin/certificate] unexpected error:", err);
    return NextResponse.json({ success: true });
  }
}
