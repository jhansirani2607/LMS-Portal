import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/login
 * Validates credentials against SQLite DB or returns demo authentication response.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: string;
      password?: string;
      role?: string;
    } | null;

    if (!body || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();
    const password = body.password.trim();
    const role = (body.role || "student").toLowerCase();

    // 1. Check Admin
    if (role === "admin") {
      if (
        (email === "admin@avmsmart.in" || email === "admin" || email === "anand@avmsmart.in") &&
        (password === "admin123" || password === "admin")
      ) {
        return NextResponse.json({
          success: true,
          user: {
            id: "admin-1",
            name: "A. Anand Raju",
            email: "admin@avmsmart.in",
            role: "admin",
            status: "Active",
          },
        });
      }
      return NextResponse.json(
        { success: false, error: "Invalid admin credentials. Use admin@avmsmart.in / admin123" },
        { status: 401 }
      );
    }

    // 2. Check Mentor
    if (role === "mentor") {
      if (
        (email === "mentor@avmsmart.in" || email === "mentor" || email === "mahendra@avmsmart.in") &&
        (password === "mentor123" || password === "mentor")
      ) {
        return NextResponse.json({
          success: true,
          user: {
            id: "mentor-1",
            name: "Mahendra Cheerla",
            email: "mentor@avmsmart.in",
            role: "mentor",
            status: "Active",
          },
        });
      }
      return NextResponse.json(
        { success: false, error: "Invalid mentor credentials. Use mentor@avmsmart.in / mentor123" },
        { status: 401 }
      );
    }

    // 3. Check Student in Prisma DB
    try {
      const student = await db.studentRegistration.findFirst({
        where: { email },
      });

      if (student) {
        if (student.password === password) {
          const studentStatus = (student as any).status || "Pending";
          if (studentStatus === "Pending") {
            return NextResponse.json(
              {
                success: false,
                error: "Your registration is awaiting Admin approval. You will be able to log in once the Administrator accepts your account.",
                pendingApproval: true,
              },
              { status: 403 }
            );
          }
          if (studentStatus === "Rejected") {
            return NextResponse.json(
              { success: false, error: "Your registration application was not approved by the Administrator." },
              { status: 403 }
            );
          }
          if (studentStatus === "Suspended") {
            return NextResponse.json(
              { success: false, error: "Your student account has been suspended by the Administrator. Please contact support." },
              { status: 403 }
            );
          }

          return NextResponse.json({
            success: true,
            user: {
              id: student.id,
              name: student.fullName,
              email: student.email,
              role: "student",
              phone: student.phone,
              education: student.education,
              yearOfStudy: student.yearOfStudy,
              preferredDomain: student.preferredDomain,
              status: studentStatus,
            },
          });
        }
        return NextResponse.json(
          { success: false, error: "Incorrect password for this student account" },
          { status: 401 }
        );
      }
    } catch (dbErr) {
      console.warn("[api/login] DB lookup skipped or failed:", dbErr);
    }

    // Default demo student fallback
    if (
      (email === "student@avmsmart.in" || email === "aarav@example.com" || email === "student") &&
      (password === "student123" || password === "password123")
    ) {
      return NextResponse.json({
        success: true,
        user: {
          id: "stu-1",
          name: "Aarav Sharma",
          email: "student@avmsmart.in",
          role: "student",
          preferredDomain: "MERN Full Stack Development",
          status: "Active",
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials. Please register or use student@avmsmart.in / student123" },
      { status: 401 }
    );
  } catch (err) {
    console.error("[api/login] unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
