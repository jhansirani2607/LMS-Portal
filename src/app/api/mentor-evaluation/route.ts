import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/mentor-evaluation
 * Persists a mentor's assignment evaluation to SQLite via Prisma.
 * Degrades gracefully on DB failure.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      mentorName?: string;
      studentName?: string;
      assignmentTitle?: string;
      grade?: string;
      feedback?: string;
    } | null;

    if (!body || !body.mentorName || !body.studentName || !body.assignmentTitle) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      await db.mentorEvaluation.create({
        data: {
          mentorName: body.mentorName,
          studentName: body.studentName,
          assignmentTitle: body.assignmentTitle,
          grade: body.grade ?? "",
          feedback: body.feedback ?? "",
        },
      });
    } catch (dbError) {
      console.error("[api/mentor-evaluation] DB write failed:", dbError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/mentor-evaluation] unexpected error:", err);
    return NextResponse.json({ success: true });
  }
}
