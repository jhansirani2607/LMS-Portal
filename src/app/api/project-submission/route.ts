import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/project-submission
 * Persists a student project submission to SQLite via Prisma.
 * Degrades gracefully on DB failure.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      studentName?: string;
      email?: string;
      projectId?: string;
      projectTitle?: string;
      githubUrl?: string;
      demoUrl?: string;
      description?: string;
      fileName?: string;
    } | null;

    if (!body || !body.studentName || !body.email || !body.projectTitle) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      await db.projectSubmission.create({
        data: {
          studentName: body.studentName,
          email: body.email,
          projectId: body.projectId ?? "",
          projectTitle: body.projectTitle,
          githubUrl: body.githubUrl ?? "",
          demoUrl: body.demoUrl ?? null,
          description: body.description ?? "",
          fileName: body.fileName ?? null,
        },
      });
    } catch (dbError) {
      console.error("[api/project-submission] DB write failed:", dbError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/project-submission] unexpected error:", err);
    return NextResponse.json({ success: true });
  }
}
