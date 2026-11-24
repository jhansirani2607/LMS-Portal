// AVM Smart Solutions — Unified Portal Data Store & Authentication Engine
// Bridges client-side persistence (localStorage) with API backend synchronization
// for seamless full functionality across Registration, Login, and Admin portals.

import {
  adminStudents as defaultAdminStudents,
  adminApplications as defaultAdminApplications,
  adminCertificates as defaultAdminCertificates,
  verifiableCertificates as defaultVerifiableCertificates,
  mentors,
  adminCourses,
  adminInternships,
  lmsCourses,
  findCourseByDomain,
  lmsUser as defaultLmsUser,
  type AdminStudent,
  type AdminApplication,
  type AdminCertificate,
  type VerifiableCertificate,
  type LMSCourse,
} from "./data";
import type { Role } from "./navigation";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  education?: string;
  yearOfStudy?: string;
  preferredDomain?: string;
  mentor?: string;
  progress?: number;
  status: "Active" | "Suspended" | "Completed" | "Pending" | "Rejected";
  avatarInitials: string;
  enrolledOn: string;
}

export interface RegisteredAccount extends AuthUser {
  password: string;
}

export interface CourseEnrollmentRequest {
  id: string;
  studentEmail: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  category: string;
  requestedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  notes?: string;
}

// Storage Keys
const STORAGE_KEYS = {
  CURRENT_USER: "avm_current_user",
  AUTH_ROLE: "avm_auth_role",
  REGISTERED_STUDENTS: "avm_registered_students",
  ADMIN_STUDENTS: "avm_admin_students",
  ADMIN_APPLICATIONS: "avm_admin_applications",
  ADMIN_CERTIFICATES: "avm_admin_certificates",
  COURSE_ENROLLMENTS: "avm_course_enrollments",
} as const;

// Default demo credentials & accounts
export const DEMO_CREDENTIALS = {
  student: {
    email: "student@avmsmart.in",
    password: "student123",
    name: "Aarav Sharma",
    role: "student" as Role,
    domain: "MERN Full Stack Development",
    mentor: "Mahendra Cheerla",
  },
  mentor: {
    email: "mentor@avmsmart.in",
    password: "mentor123",
    name: "Mahendra Cheerla",
    role: "mentor" as Role,
    expertise: "Java, Spring Boot, React, Next.js",
  },
  admin: {
    email: "admin@avmsmart.in",
    password: "admin123",
    name: "A. Anand Raju",
    role: "admin" as Role,
    title: "Founder & CEO",
  },
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getInitials(name: string): string {
  if (!name.trim()) return "ST";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Reads registered student accounts from localStorage.
 */
export function getRegisteredAccounts(): RegisteredAccount[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_STUDENTS);
    if (!raw) return [];
    return JSON.parse(raw) as RegisteredAccount[];
  } catch {
    return [];
  }
}

/**
 * Broadcasts store change events across components and tabs in real-time.
 */
export function broadcastStoreChange(type: string, payload?: unknown): void {
  if (!isBrowser()) return;
  try {
    window.dispatchEvent(
      new CustomEvent("avm_store_updated", {
        detail: { type, payload, timestamp: Date.now() },
      })
    );
  } catch {
    /* ignore */
  }
}

/**
 * Checks whether an email address is already registered in the system
 * across demo accounts, registered student accounts, and admin student records.
 */
export function isEmailRegistered(email: string): {
  registered: boolean;
  status?: AdminStudent["status"];
  name?: string;
  source?: "demo" | "registered" | "admin";
  message?: string;
} {
  const clean = email.trim().toLowerCase();
  if (!clean) return { registered: false };

  // 1. Check demo accounts
  if (clean === DEMO_CREDENTIALS.student.email.toLowerCase()) {
    return {
      registered: true,
      status: "Active",
      name: DEMO_CREDENTIALS.student.name,
      source: "demo",
      message: "An active demo student account already exists with this email.",
    };
  }
  if (clean === DEMO_CREDENTIALS.admin.email.toLowerCase()) {
    return {
      registered: true,
      status: "Active",
      name: DEMO_CREDENTIALS.admin.name,
      source: "demo",
      message: "This email belongs to an Administrator account.",
    };
  }
  if (clean === DEMO_CREDENTIALS.mentor.email.toLowerCase()) {
    return {
      registered: true,
      status: "Active",
      name: DEMO_CREDENTIALS.mentor.name,
      source: "demo",
      message: "This email belongs to a Mentor account.",
    };
  }

  // 2. Check dynamically registered student accounts
  const registered = getRegisteredAccounts();
  const matchedReg = registered.find((a) => a.email.toLowerCase() === clean);
  if (matchedReg) {
    const status = matchedReg.status || "Pending";
    return {
      registered: true,
      status,
      name: matchedReg.name,
      source: "registered",
      message:
        status === "Pending"
          ? "This email is already registered and is awaiting Admin approval. Please wait for the administrator to accept your account."
          : status === "Active"
          ? "An account with this email is already registered and approved. Please sign in to your student portal."
          : status === "Suspended"
          ? "This student account is currently suspended by the Administrator."
          : "A registration with this email was previously rejected.",
    };
  }

  // 3. Check admin students list
  const adminStudents = getAdminStudentsList();
  const matchedAdmin = adminStudents.find((s) => s.email.toLowerCase() === clean);
  if (matchedAdmin) {
    const status = matchedAdmin.status || "Pending";
    return {
      registered: true,
      status,
      name: matchedAdmin.name,
      source: "admin",
      message:
        status === "Pending"
          ? "This email is already registered and is awaiting Admin approval."
          : status === "Active"
          ? "An account with this email is already registered and active."
          : "This account is inactive.",
    };
  }

  return { registered: false };
}

/**
 * Saves registered student accounts to localStorage and broadcasts update.
 */
function saveRegisteredAccounts(accounts: RegisteredAccount[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_STUDENTS, JSON.stringify(accounts));
    broadcastStoreChange("registered_students_saved", accounts);
  } catch {
    /* ignore */
  }
}

export interface RegisterResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  alreadyRegistered?: boolean;
  status?: AdminStudent["status"];
}

/**
 * Registers a new student account with initial status "Pending" (requires Admin approval).
 * Checks for duplicates so that if a student is already registered, it returns an explicit error!
 */
export function registerStudentAccount(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  education: string;
  yearOfStudy: string;
  preferredDomain: string;
  hearAbout?: string;
}): RegisterResult {
  const cleanEmail = data.email.trim().toLowerCase();

  // Strict duplicate check!
  const duplicateCheck = isEmailRegistered(cleanEmail);
  if (duplicateCheck.registered) {
    return {
      success: false,
      alreadyRegistered: true,
      status: duplicateCheck.status,
      error: duplicateCheck.message || "This email address is already registered.",
    };
  }

  const existing = getRegisteredAccounts();

  const newAccount: RegisteredAccount = {
    id: `stu-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: data.fullName.trim(),
    email: cleanEmail,
    password: data.password,
    role: "student",
    phone: data.phone.trim(),
    education: data.education,
    yearOfStudy: data.yearOfStudy,
    preferredDomain: data.preferredDomain,
    mentor: "Mahendra Cheerla",
    progress: 0,
    status: "Pending", // <-- PENDING ADMIN APPROVAL!
    avatarInitials: getInitials(data.fullName),
    enrolledOn: new Date().toISOString().slice(0, 10),
  };

  const updated = [newAccount, ...existing];
  saveRegisteredAccounts(updated);

  // Sync to Admin Students list as Pending immediately
  syncNewStudentToAdmin(newAccount);

  // Broadcast live sync event across the entire app
  broadcastStoreChange("student_registered", newAccount);

  const safeUser: AuthUser = {
    id: newAccount.id,
    name: newAccount.name,
    email: newAccount.email,
    role: newAccount.role,
    phone: newAccount.phone,
    education: newAccount.education,
    yearOfStudy: newAccount.yearOfStudy,
    preferredDomain: newAccount.preferredDomain,
    mentor: newAccount.mentor,
    progress: newAccount.progress,
    status: newAccount.status,
    avatarInitials: newAccount.avatarInitials,
    enrolledOn: newAccount.enrolledOn,
  };

  return {
    success: true,
    user: safeUser,
  };
}

/**
 * Syncs newly registered student into admin students pool as Pending.
 */
function syncNewStudentToAdmin(account: RegisteredAccount) {
  if (!isBrowser()) return;
  const adminList = getAdminStudentsList();
  const filtered = adminList.filter(
    (s) => s.email.toLowerCase() !== account.email.toLowerCase()
  );

  const adminStudent: AdminStudent = {
    id: account.id,
    name: account.name,
    email: account.email,
    domain: account.preferredDomain || "MERN Full Stack Development",
    mentor: account.mentor || "Mahendra Cheerla",
    progress: account.progress ?? 0,
    status: account.status || "Pending",
    initials: account.avatarInitials,
    enrolledOn: account.enrolledOn,
    phone: account.phone,
    education: account.education,
    yearOfStudy: account.yearOfStudy,
  };

  saveAdminStudentsList([adminStudent, ...filtered]);
}

/**
 * Authenticates user credentials for a specific role with strict status checks.
 */
export function authenticateUser(
  email: string,
  pass: string,
  role: Role
): { success: boolean; user?: AuthUser; error?: string; pendingApproval?: boolean } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: "Please enter both email and password." };
  }

  // 1. ADMIN AUTHENTICATION
  if (role === "admin") {
    if (
      (cleanEmail === DEMO_CREDENTIALS.admin.email.toLowerCase() ||
        cleanEmail === "anand@avmsmart.in" ||
        cleanEmail === "admin") &&
      (cleanPass === DEMO_CREDENTIALS.admin.password || cleanPass === "admin123")
    ) {
      const adminUser: AuthUser = {
        id: "admin-1",
        name: DEMO_CREDENTIALS.admin.name,
        email: DEMO_CREDENTIALS.admin.email,
        role: "admin",
        avatarInitials: "AR",
        status: "Active",
        enrolledOn: "2024-01-01",
      };
      return { success: true, user: adminUser };
    }
    return {
      success: false,
      error: "Invalid admin credentials. Use admin@avmsmart.in / admin123.",
    };
  }

  // 2. MENTOR AUTHENTICATION
  if (role === "mentor") {
    const matchedMentor = mentors.find(
      (m) =>
        m.email.toLowerCase() === cleanEmail ||
        m.name.toLowerCase().includes(cleanEmail)
    );
    if (
      (cleanEmail === DEMO_CREDENTIALS.mentor.email.toLowerCase() ||
        cleanEmail === "mentor" ||
        matchedMentor) &&
      (cleanPass === DEMO_CREDENTIALS.mentor.password || cleanPass === "mentor123")
    ) {
      const name = matchedMentor ? matchedMentor.name : DEMO_CREDENTIALS.mentor.name;
      const mentorUser: AuthUser = {
        id: matchedMentor ? matchedMentor.id : "mentor-1",
        name,
        email: matchedMentor ? matchedMentor.email : DEMO_CREDENTIALS.mentor.email,
        role: "mentor",
        avatarInitials: getInitials(name),
        status: "Active",
        enrolledOn: "2024-01-01",
      };
      return { success: true, user: mentorUser };
    }
    return {
      success: false,
      error: "Invalid mentor credentials. Use mentor@avmsmart.in / mentor123.",
    };
  }

  // 3. STUDENT AUTHENTICATION
  // A. Check dynamically registered student accounts first
  const registered = getRegisteredAccounts();
  const matchedStudent = registered.find(
    (a) => a.email.toLowerCase() === cleanEmail
  );
  if (matchedStudent) {
    if (matchedStudent.password === cleanPass) {
      // Check status!
      if (matchedStudent.status === "Pending") {
        return {
          success: false,
          error: "Your registration is awaiting Admin approval. You will be able to log in once the Administrator accepts your account.",
          pendingApproval: true,
        };
      }
      if (matchedStudent.status === "Rejected") {
        return {
          success: false,
          error: "Your registration application was not approved by the Administrator.",
        };
      }
      if (matchedStudent.status === "Suspended") {
        return {
          success: false,
          error: "Your student account has been suspended by the Administrator. Please contact support.",
        };
      }

      const { password: _, ...safeUser } = matchedStudent;
      return { success: true, user: safeUser };
    }
    return { success: false, error: "Incorrect password for this student account." };
  }

  // B. Check default demo student credentials
  if (
    (cleanEmail === DEMO_CREDENTIALS.student.email.toLowerCase() ||
      cleanEmail === "student" ||
      cleanEmail === "aarav@example.com" ||
      cleanEmail === "aarav.sharma@avmsmartsolutions.com") &&
    (cleanPass === DEMO_CREDENTIALS.student.password || cleanPass === "password123")
  ) {
    const demoStudent: AuthUser = {
      id: "stu-1",
      name: DEMO_CREDENTIALS.student.name,
      email: DEMO_CREDENTIALS.student.email,
      role: "student",
      phone: "+91 98765 43210",
      education: "B.Tech Computer Science",
      yearOfStudy: "3rd Year",
      preferredDomain: DEMO_CREDENTIALS.student.domain,
      mentor: DEMO_CREDENTIALS.student.mentor,
      progress: 68,
      status: "Active",
      avatarInitials: "AS",
      enrolledOn: "2024-08-15",
    };
    return { success: true, user: demoStudent };
  }

  return {
    success: false,
    error:
      "No student account found with this email. Please register first or use student@avmsmart.in / student123.",
  };
}

/**
 * Gets currently logged-in user from localStorage.
 */
export function getCurrentUser(): AuthUser | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Sets or clears the current logged-in user in localStorage.
 */
export function setCurrentUser(user: AuthUser | null): void {
  if (!isBrowser()) return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.AUTH_ROLE, user.role);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_ROLE);
    }
  } catch {
    /* ignore storage errors */
  }
}

// -------------------------------------------------------------
// ADMIN STUDENTS MANAGEMENT & APPROVAL WORKFLOW
// -------------------------------------------------------------

export function getAdminStudentsList(): AdminStudent[] {
  if (!isBrowser()) return defaultAdminStudents;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_STUDENTS);
    let list: AdminStudent[] = raw ? JSON.parse(raw) : defaultAdminStudents;

    // Merge in any registered student accounts not yet in list
    const registered = getRegisteredAccounts();
    const existingEmails = new Set(list.map((s) => s.email.toLowerCase()));
    const missing: AdminStudent[] = [];

    for (const reg of registered) {
      if (!existingEmails.has(reg.email.toLowerCase())) {
        missing.push({
          id: reg.id,
          name: reg.name,
          email: reg.email,
          domain: reg.preferredDomain || "MERN Full Stack Development",
          mentor: reg.mentor || "Mahendra Cheerla",
          progress: reg.progress ?? 0,
          status: reg.status || "Pending",
          initials: reg.avatarInitials,
          enrolledOn: reg.enrolledOn,
          phone: reg.phone,
          education: reg.education,
          yearOfStudy: reg.yearOfStudy,
        });
        existingEmails.add(reg.email.toLowerCase());
      }
    }

    if (missing.length > 0) {
      list = [...missing, ...list];
      localStorage.setItem(STORAGE_KEYS.ADMIN_STUDENTS, JSON.stringify(list));
    }

    return list;
  } catch {
    return defaultAdminStudents;
  }
}

export function saveAdminStudentsList(students: AdminStudent[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(
      STORAGE_KEYS.ADMIN_STUDENTS,
      JSON.stringify(students)
    );
    broadcastStoreChange("admin_students_saved", students);
  } catch {
    /* ignore */
  }
}

/**
 * Updates an admin student record and synchronizes with Registered Accounts
 * so that when an Admin Approves, Suspends, or Updates a student, it takes effect instantly!
 */
export function updateAdminStudent(
  id: string,
  updates: Partial<AdminStudent>
): AdminStudent[] {
  const current = getAdminStudentsList();
  const next = current.map((s) => (s.id === id ? { ...s, ...updates } : s));
  saveAdminStudentsList(next);

  // Synchronize into Registered Accounts pool
  if (isBrowser()) {
    const registered = getRegisteredAccounts();
    const updatedReg = registered.map((reg) => {
      if (
        reg.id === id ||
        (updates.email && reg.email.toLowerCase() === updates.email.toLowerCase())
      ) {
        return {
          ...reg,
          ...(updates.name ? { name: updates.name } : {}),
          ...(updates.email ? { email: updates.email } : {}),
          ...(updates.domain ? { preferredDomain: updates.domain } : {}),
          ...(updates.mentor ? { mentor: updates.mentor } : {}),
          ...(updates.progress !== undefined ? { progress: updates.progress } : {}),
          ...(updates.status ? { status: updates.status } : {}),
          ...(updates.phone ? { phone: updates.phone } : {}),
          ...(updates.education ? { education: updates.education } : {}),
        };
      }
      return reg;
    });
    saveRegisteredAccounts(updatedReg);

    // Synchronize currently logged-in student user session in real-time
    const curr = getCurrentUser();
    if (
      curr &&
      (curr.id === id ||
        (updates.email && curr.email.toLowerCase() === updates.email.toLowerCase()))
    ) {
      setCurrentUser({
        ...curr,
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.status ? { status: updates.status } : {}),
        ...(updates.domain ? { preferredDomain: updates.domain } : {}),
        ...(updates.mentor ? { mentor: updates.mentor } : {}),
        ...(updates.progress !== undefined ? { progress: updates.progress } : {}),
      });
    }

    broadcastStoreChange("admin_student_updated", { id, updates });
  }

  return next;
}

/**
 * Deletes a student from Admin students and registered accounts pool synchronously.
 */
export function deleteAdminStudent(studentId: string): AdminStudent[] {
  const current = getAdminStudentsList();
  const toDelete = current.find((s) => s.id === studentId);
  const next = current.filter((s) => s.id !== studentId);
  saveAdminStudentsList(next);

  if (isBrowser() && toDelete) {
    const registered = getRegisteredAccounts();
    const updatedReg = registered.filter(
      (r) => r.id !== studentId && r.email.toLowerCase() !== toDelete.email.toLowerCase()
    );
    saveRegisteredAccounts(updatedReg);

    // If currently logged-in user was this student, clear user session
    const curr = getCurrentUser();
    if (
      curr &&
      (curr.id === studentId ||
        curr.email.toLowerCase() === toDelete.email.toLowerCase())
    ) {
      setCurrentUser(null);
    }
    broadcastStoreChange("student_deleted", { id: studentId, email: toDelete.email });
  }

  return next;
}

/**
 * Admin action: Approve / Accept a student registration so they can log in!
 */
export function approveStudentRegistration(studentId: string): AdminStudent[] {
  return updateAdminStudent(studentId, { status: "Active" });
}

/**
 * Admin action: Reject a student registration.
 */
export function rejectStudentRegistration(studentId: string): AdminStudent[] {
  return updateAdminStudent(studentId, { status: "Rejected" });
}

export function addAdminStudent(data: {
  name: string;
  email: string;
  domain: string;
  mentor: string;
  phone?: string;
  education?: string;
}): AdminStudent {
  const current = getAdminStudentsList();
  const newStudent: AdminStudent = {
    id: `stu-${Date.now()}`,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    domain: data.domain,
    mentor: data.mentor || "Mahendra Cheerla",
    progress: 0,
    status: "Active", // Manually added by admin is Active directly
    initials: getInitials(data.name),
    enrolledOn: new Date().toISOString().slice(0, 10),
    phone: data.phone,
    education: data.education,
  };
  const next = [newStudent, ...current];
  saveAdminStudentsList(next);
  return newStudent;
}

// -------------------------------------------------------------
// ADMIN APPLICATIONS MANAGEMENT
// -------------------------------------------------------------

export function getAdminApplicationsList(): AdminApplication[] {
  if (!isBrowser()) return defaultAdminApplications;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_APPLICATIONS);
    if (!raw) return defaultAdminApplications;
    return JSON.parse(raw);
  } catch {
    return defaultAdminApplications;
  }
}

export function saveAdminApplicationsList(apps: AdminApplication[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(
      STORAGE_KEYS.ADMIN_APPLICATIONS,
      JSON.stringify(apps)
    );
  } catch {
    /* ignore */
  }
}

export function addAdminApplication(app: {
  name: string;
  email: string;
  phone: string;
  domain: string;
  education?: string;
  programType?: string;
  notes?: string;
}): AdminApplication {
  const current = getAdminApplicationsList();
  const newApp: AdminApplication = {
    id: `app-${Date.now()}`,
    name: app.name.trim(),
    email: app.email.trim(),
    phone: app.phone.trim(),
    domain: app.domain,
    education: app.education,
    programType: app.programType,
    appliedDate: new Date().toISOString().slice(0, 10),
    status: "Pending",
    notes: app.notes,
  };
  const next = [newApp, ...current];
  saveAdminApplicationsList(next);
  return newApp;
}

export function updateAdminApplication(
  id: string,
  updates: Partial<AdminApplication>
): AdminApplication[] {
  const current = getAdminApplicationsList();
  const next = current.map((a) => (a.id === id ? { ...a, ...updates } : a));
  saveAdminApplicationsList(next);
  return next;
}

// -------------------------------------------------------------
// CERTIFICATES & VERIFICATION MANAGEMENT
// -------------------------------------------------------------

export function getAdminCertificatesList(): AdminCertificate[] {
  if (!isBrowser()) return defaultAdminCertificates;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_CERTIFICATES);
    if (!raw) return defaultAdminCertificates;
    return JSON.parse(raw);
  } catch {
    return defaultAdminCertificates;
  }
}

export function saveAdminCertificatesList(certs: AdminCertificate[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(
      STORAGE_KEYS.ADMIN_CERTIFICATES,
      JSON.stringify(certs)
    );
  } catch {
    /* ignore */
  }
}

export function issueAdminCertificate(data: {
  studentName: string;
  courseTitle: string;
  issueDate?: string;
}): AdminCertificate {
  const current = getAdminCertificatesList();
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const certId = `AVM-CERT-${year}-${randNum}`;

  const newCert: AdminCertificate = {
    id: `ac-${Date.now()}`,
    certificateId: certId,
    studentName: data.studentName.trim(),
    courseTitle: data.courseTitle.trim(),
    issueDate: data.issueDate || new Date().toISOString().slice(0, 10),
    status: "Issued",
  };

  const next = [newCert, ...current];
  saveAdminCertificatesList(next);
  return newCert;
}

/**
 * Verifies certificate across both seed certificates and newly issued admin certificates!
 */
export function verifyCertificateLive(certId: string): VerifiableCertificate | null {
  const cleanId = certId.trim().toLowerCase();
  if (!cleanId) return null;

  // 1. Check newly issued admin certificates
  const adminCerts = getAdminCertificatesList();
  const foundAdmin = adminCerts.find(
    (c) => c.certificateId.toLowerCase() === cleanId
  );
  if (foundAdmin) {
    return {
      certificateId: foundAdmin.certificateId,
      studentName: foundAdmin.studentName,
      courseTitle: foundAdmin.courseTitle,
      issueDate: foundAdmin.issueDate,
      issuedBy: "AVM Smart Solutions",
      status: foundAdmin.status === "Issued" ? "Valid" : "Revoked",
    };
  }

  // 2. Check pre-seeded verifiable certificates
  const foundSeed = defaultVerifiableCertificates.find(
    (c) => c.certificateId.toLowerCase() === cleanId
  );
  return foundSeed ?? null;
}

// -------------------------------------------------------------
// DYNAMIC METRICS FOR ADMIN DASHBOARD
// -------------------------------------------------------------

export function getLiveAdminStats() {
  const students = getAdminStudentsList();
  const apps = getAdminApplicationsList();
  const certs = getAdminCertificatesList();

  return {
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.status === "Active").length,
    pendingStudents: students.filter((s) => s.status === "Pending").length,
    totalMentors: mentors.length,
    activeInternships: adminInternships.filter((i) => i.active).length,
    pendingApplications: apps.filter((a) => a.status === "Pending").length,
    issuedCertificates: certs.filter((c) => c.status === "Issued").length,
    totalCourses: adminCourses.length,
    pendingCourseRequests: getCourseEnrollmentRequests().filter((r) => r.status === "Pending").length,
  };
}

// -------------------------------------------------------------
// COURSE ENROLLMENT REQUESTS & STUDENT COURSE ACCESS
// -------------------------------------------------------------

export function getCourseEnrollmentRequests(): CourseEnrollmentRequest[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSE_ENROLLMENTS);
    if (!raw) return [];
    return JSON.parse(raw) as CourseEnrollmentRequest[];
  } catch {
    return [];
  }
}

export function saveCourseEnrollmentRequests(requests: CourseEnrollmentRequest[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.COURSE_ENROLLMENTS, JSON.stringify(requests));
    broadcastStoreChange("course_enrollments_updated", requests);
  } catch {
    /* ignore */
  }
}

export function requestCourseEnrollment(data: {
  studentEmail: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  category: string;
  notes?: string;
}): { success: boolean; message: string; request?: CourseEnrollmentRequest } {
  const cleanEmail = data.studentEmail.trim().toLowerCase();
  const current = getCourseEnrollmentRequests();

  // Check if already requested or approved
  const existing = current.find(
    (r) =>
      r.studentEmail.toLowerCase() === cleanEmail &&
      r.courseId.toLowerCase() === data.courseId.toLowerCase()
  );

  if (existing) {
    if (existing.status === "Approved") {
      return {
        success: false,
        message: `You are already enrolled in "${data.courseTitle}".`,
      };
    }
    if (existing.status === "Pending") {
      return {
        success: false,
        message: `Your enrollment request for "${data.courseTitle}" is already pending Admin approval.`,
      };
    }
  }

  const newReq: CourseEnrollmentRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    studentEmail: cleanEmail,
    studentName: data.studentName.trim(),
    courseId: data.courseId,
    courseTitle: data.courseTitle,
    category: data.category,
    requestedDate: new Date().toISOString().slice(0, 10),
    status: "Pending",
    notes: data.notes,
  };

  const updated = [newReq, ...current.filter((r) => r.id !== newReq.id)];
  saveCourseEnrollmentRequests(updated);

  return {
    success: true,
    message: `Enrollment request for "${data.courseTitle}" submitted successfully! Awaiting Admin approval.`,
    request: newReq,
  };
}

export function approveCourseEnrollment(requestId: string): CourseEnrollmentRequest[] {
  const current = getCourseEnrollmentRequests();
  const updated = current.map((r) =>
    r.id === requestId ? { ...r, status: "Approved" as const } : r
  );
  saveCourseEnrollmentRequests(updated);
  return updated;
}

export function rejectCourseEnrollment(requestId: string): CourseEnrollmentRequest[] {
  const current = getCourseEnrollmentRequests();
  const updated = current.map((r) =>
    r.id === requestId ? { ...r, status: "Rejected" as const } : r
  );
  saveCourseEnrollmentRequests(updated);
  return updated;
}

export function getStudentEnrolledCourses(
  studentEmail?: string,
  preferredDomain?: string
): LMSCourse[] {
  const cleanEmail = studentEmail?.trim().toLowerCase() || "";

  // 1. Primary course mapped from their registered preferredDomain
  const primaryCourse = findCourseByDomain(preferredDomain);

  // 2. Any additional courses requested and Approved by Admin
  const requests = getCourseEnrollmentRequests().filter(
    (r) => r.studentEmail.toLowerCase() === cleanEmail && r.status === "Approved"
  );
  const approvedCourses = requests
    .map((r) => lmsCourses.find((c) => c.id === r.courseId))
    .filter((c): c is LMSCourse => Boolean(c));

  // Merge primary course + approved courses (avoiding duplicates)
  const combined = [primaryCourse, ...approvedCourses];
  const unique = Array.from(new Map(combined.map((c) => [c.id, c])).values());

  return unique;
}

export function getStudentPendingCourses(studentEmail?: string): CourseEnrollmentRequest[] {
  const cleanEmail = studentEmail?.trim().toLowerCase() || "";
  if (!cleanEmail) return [];
  return getCourseEnrollmentRequests().filter(
    (r) => r.studentEmail.toLowerCase() === cleanEmail && r.status === "Pending"
  );
}
