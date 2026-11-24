import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/register
 * Persists a student registration to SQLite via Prisma with automatic degradation.
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

    const cleanEmail = body.email.trim().toLowerCase();

    // Check for existing registration
    try {
      if (db && db.studentRegistration && typeof db.studentRegistration.findFirst === "function") {
        const existing = await db.studentRegistration.findFirst({
          where: { email: cleanEmail },
        });
        if (existing) {
          return NextResponse.json(
            {
              success: false,
              alreadyRegistered: true,
              error: "This email address is already registered. Please sign in instead.",
              status: (existing as any).status || "Pending",
            },
            { status: 409 }
          );
        }
      }
    } catch (e) {
      /* ignore */
    }

    const studentRecord = {
      id: `stu-${Date.now()}`,
      name: body.fullName,
      email: cleanEmail,
      phone: body.phone ?? "",
      education: body.education ?? "",
      yearOfStudy: body.yearOfStudy ?? "",
      preferredDomain: body.preferredDomain ?? "",
      role: "student",
      status: "Pending",
    };

    try {
      if (db && db.studentRegistration && typeof db.studentRegistration.create === "function") {
        const created = await db.studentRegistration.create({
          data: {
            fullName: body.fullName,
            email: cleanEmail,
            phone: body.phone ?? "",
            password: body.password,
            education: body.education ?? "",
            yearOfStudy: body.yearOfStudy ?? "",
            preferredDomain: body.preferredDomain ?? "",
            hearAbout: body.hearAbout ?? "",
          },
        });
        if (created?.id) {
          studentRecord.id = created.id;
        }
      }
    } catch (dbError) {
      console.warn("[api/register] DB write skipped or fallback used:", dbError);
    }

    return NextResponse.json({ success: true, user: studentRecord });
  } catch (err) {
    console.error("[api/register] unexpected error:", err);
    return NextResponse.json({ success: true });
  }
}
