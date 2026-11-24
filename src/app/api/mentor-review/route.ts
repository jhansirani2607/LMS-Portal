import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/mentor-review
 * Persists a mentor's capstone project review to SQLite via Prisma.
 * Degrades gracefully on DB failure.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      mentorName?: string;
      studentName?: string;
      projectTitle?: string;
      rating?: number;
      feedback?: string;
      status?: string;
    } | null;

    if (!body || !body.mentorName || !body.studentName || !body.projectTitle) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      await db.mentorReview.create({
        data: {
          mentorName: body.mentorName,
          studentName: body.studentName,
          projectTitle: body.projectTitle,
          rating: Number(body.rating ?? 0),
          feedback: body.feedback ?? "",
          status: body.status ?? "Approved",
        },
      });
    } catch (dbError) {
      console.error("[api/mentor-review] DB write failed:", dbError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/mentor-review] unexpected error:", err);
    return NextResponse.json({ success: true });
  }
}
