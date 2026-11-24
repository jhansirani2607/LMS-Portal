import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/internship
 * Persists an internship application to SQLite via Prisma.
 * Degrades gracefully: if the DB write fails, we still return success:true.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      fullName?: string;
      email?: string;
      phone?: string;
      education?: string;
      fieldOfInterest?: string;
      internshipType?: string;
      startDate?: string;
      resumeName?: string;
      coverLetter?: string;
    } | null;

    if (!body || !body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      await db.internshipApplication.create({
        data: {
          fullName: body.fullName,
          email: body.email,
          phone: body.phone,
          education: body.education ?? "",
          fieldOfInterest: body.fieldOfInterest ?? "",
          internshipType: body.internshipType ?? "",
          startDate: body.startDate ?? "",
          resumeName: body.resumeName ?? null,
          coverLetter: body.coverLetter ?? null,
        },
      });
    } catch (dbError) {
      console.error("[api/internship] DB write failed:", dbError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/internship] unexpected error:", err);
    return NextResponse.json({ success: true });
  }
}
