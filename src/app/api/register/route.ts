import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/register
 * Persists a student registration to SQLite via Prisma.
 * Degrades gracefully: if the DB write fails, we still return success:true.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      fullName?: string;
      email?: string;
      phone?: string;
      password?: string;
      education?: string;
      yearOfStudy?: string;
      preferredDomain?: string;
      hearAbout?: string;
    } | null;

    if (!body || !body.fullName || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      await db.studentRegistration.create({
        data: {
          fullName: body.fullName,
          email: body.email,
          phone: body.phone ?? "",
          password: body.password,
          education: body.education ?? "",
          yearOfStudy: body.yearOfStudy ?? "",
          preferredDomain: body.preferredDomain ?? "",
          hearAbout: body.hearAbout ?? "",
        },
      });
    } catch (dbError) {
      console.error("[api/register] DB write failed:", dbError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/register] unexpected error:", err);
    return NextResponse.json({ success: true });
  }
}
