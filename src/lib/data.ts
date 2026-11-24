// AVM Smart Solutions — Central data file
// Rebuilt for the Internship & LMS platform.
// Real AVM company data + internship/LMS-focused content + sample portal data.
// Existing LMS course/assignment/quiz/grade/certificate data is preserved below.

import type { NavItem } from "./navigation";

/* ------------------------------------------------------------------
 * NAVIGATION (flat — public site only)
 * ------------------------------------------------------------------ */

export const navItems: NavItem[] = [
  { label: "Home", page: "home" },
  { label: "About", page: "about" },
  { label: "Internships", page: "internships" },
  { label: "Learning", page: "learning" },
  { label: "Contact", page: "contact" },
];

/* ------------------------------------------------------------------
 * AVM COMPANY INFO (REAL — verified from avmsmart.in)
 * ------------------------------------------------------------------ */

export interface AVMCoFounder {
  name: string;
  role: string;
  expertise: string;
  initials: string;
}

export interface AVMCompanyInfo {
  name: string;
  tagline: string;
  location: string;
  email: string;
  phones: string[];
  whatsapp: string;
  whatsappHref: string;
  address: string;
  founder: {
    name: string;
    title: string;
    bio: string;
    initials: string;
  };
  coFounders: AVMCoFounder[];
  teamSize: number;
  teamHighlights: string[];
  socials: {
    instagram: string;
    instagramHandle: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
}

export const avmCompanyInfo: AVMCompanyInfo = {
  name: "AVM Smart Solutions",
  tagline: "People Build Possibilities",
  location: "Kurnool, Andhra Pradesh 518002, India",
  email: "avmsmart.official@gmail.com",
  phones: ["+91 8978040537", "+91 8247329044", "+91 9347495620"],
  whatsapp: "+91 9553357971",
  whatsappHref: "https://wa.me/919553357971",
  address: "Kurnool, Andhra Pradesh 518002, India",
  founder: {
    name: "A. Anand Raju",
    title: "Founder & CEO",
    bio: "Full Stack Engineer and YouTube creator behind 'Mr Anand Tech'. AVM Smart Solutions was founded to bridge the gap between academic learning and industry-ready engineering, combining enterprise product development with mentor-led internship programs.",
    initials: "AA",
  },
  coFounders: [
    {
      name: "Mahendra Cheerla",
      role: "Co-founder & Technical Lead",
      expertise: "Java, Spring Boot, Microservices, React, Next.js, MySQL",
      initials: "MC",
    },
    {
      name: "B.V. Madhukar",
      role: "Co-founder & Technical Lead",
      expertise: "Senior UI/UX & React Architect",
      initials: "BM",
    },
  ],
  teamSize: 11,
  teamHighlights: [
    "Sai Guru Surya Teja — MERN & DevOps",
    "Telugu Dasari Karthik — Java Full Stack",
    "Vandana Karanam — MERN & Python",
    "Bukke Reddiswapna — MERN & UI/UX",
    "Dakka Jhansi Rani — MERN",
    "Subhashini Konda — Full Stack & AI/ML",
    "Molakala Murali — Data Analyst",
    "Muraboina Manoj — Software Engineer",
  ],
  socials: {
    instagram: "https://www.instagram.com/avmsmart",
    instagramHandle: "@avmsmart",
    facebook: "#",
    twitter: "#",
    linkedin: "#",
    youtube: "#",
  },
};

/* ------------------------------------------------------------------
 * CONTACT INFO (REAL AVM data)
 * ------------------------------------------------------------------ */

export const contactInfo = {
  email: avmCompanyInfo.email,
  phones: avmCompanyInfo.phones,
  primaryPhone: avmCompanyInfo.phones[0],
  phoneHref: "tel:+918978040537",
  whatsapp: avmCompanyInfo.whatsapp,
  whatsappHref: avmCompanyInfo.whatsappHref,
  address: avmCompanyInfo.address,
  officeHours: "Mon - Sat: 9:00 AM - 7:00 PM IST",
  social: {
    facebook: avmCompanyInfo.socials.facebook,
    twitter: avmCompanyInfo.socials.twitter,
    instagram: avmCompanyInfo.socials.instagram,
    linkedin: avmCompanyInfo.socials.linkedin,
    youtube: avmCompanyInfo.socials.youtube,
  },
};

/* ------------------------------------------------------------------
 * HOME / PUBLIC STATS
 * ------------------------------------------------------------------ */

export const homeStats: { value: string; label: string }[] = [
  { value: "8", label: "Internship Domains" },
  { value: "500+", label: "Students Trained" },
  { value: "200+", label: "Mentor-Led Projects" },
];

/* ------------------------------------------------------------------
 * INTERNSHIP DOMAINS (8 — SAMPLE curriculum, editable)
 * ------------------------------------------------------------------ */

export type InternshipLevel = "Beginner" | "Intermediate" | "Advanced";

export interface InternshipDomain {
  id: string;
  title: string;
  slug: string;
  icon: string;
  duration: string;
  durationWeeks: number;
  level: InternshipLevel;
  description: string;
  technologies: string[];
  syllabusModules: string[];
  prerequisites: string[];
  outcomes: string[];
}

// SAMPLE DATA (editable) — internship program catalog
export const internshipDomains: InternshipDomain[] = [
  {
    id: "mern-fullstack",
    title: "MERN Full Stack Development",
    slug: "mern-fullstack",
    icon: "Code2",
    duration: "12 weeks",
    durationWeeks: 12,
    level: "Intermediate",
    description:
      "Build production-grade web applications end-to-end with MongoDB, Express, React and Node.js. Cover REST APIs, authentication, deployment and real-time features.",
    technologies: ["MongoDB", "Express", "React", "Node.js", "JWT", "Tailwind"],
    syllabusModules: [
      "JavaScript ES6+ & Node fundamentals",
      "Express REST API design & middleware",
      "MongoDB modelling with Mongoose",
      "React components, hooks & state",
      "Auth with JWT & role-based access",
      "Real-time features with Socket.io",
      "Deployment: Vercel + Render/MongoDB Atlas",
      "Capstone: full-stack SaaS mini app",
    ],
    prerequisites: [
      "Working knowledge of HTML, CSS & JavaScript",
      "Familiarity with the command line",
      "Git & GitHub basics",
    ],
    outcomes: [
      "Architect and ship a full-stack MERN application",
      "Design secure REST APIs with authentication",
      "Deploy production apps to the cloud",
      "Collaborate using Git workflows",
    ],
  },
  {
    id: "java-fullstack",
    title: "Java Full Stack Development",
    slug: "java-fullstack",
    icon: "Coffee",
    duration: "12 weeks",
    durationWeeks: 12,
    level: "Intermediate",
    description:
      "Master core Java, Spring Boot and REST API development with MySQL. Build enterprise backends with JPA, security and microservices foundations.",
    technologies: ["Java", "Spring Boot", "JPA/Hibernate", "MySQL", "REST", "JUnit"],
    syllabusModules: [
      "Core Java & OOP principles",
      "Collections, streams & lambdas",
      "Spring Boot & dependency injection",
      "REST controllers & exception handling",
      "JPA/Hibernate with MySQL",
      "Spring Security & JWT auth",
      "Testing with JUnit & Mockito",
      "Capstone: enterprise REST API",
    ],
    prerequisites: [
      "Basic programming knowledge",
      "Understanding of SQL fundamentals",
      "Object-oriented concepts",
    ],
    outcomes: [
      "Build robust Spring Boot REST services",
      "Model relational data with JPA",
      "Secure APIs with Spring Security",
      "Write and run automated tests",
    ],
  },
  {
    id: "mobile-flutter",
    title: "Mobile App Development — Flutter",
    slug: "mobile-flutter",
    icon: "Smartphone",
    duration: "10 weeks",
    durationWeeks: 10,
    level: "Intermediate",
    description:
      "Build cross-platform iOS & Android apps with Flutter and Dart. Cover UI, state management, API integration and publishing to app stores.",
    technologies: ["Flutter", "Dart", "Firebase", "REST", "Provider/Riverpod"],
    syllabusModules: [
      "Dart language fundamentals",
      "Flutter widgets & layout system",
      "Navigation & routing",
      "State management (Provider/Riverpod)",
      "REST API & Firebase integration",
      "Local storage & push notifications",
      "Testing & debugging Flutter apps",
      "Capstone: cross-platform mobile app",
    ],
    prerequisites: [
      "Basic programming knowledge",
      "Familiarity with OOP concepts",
      "A laptop with Flutter SDK installed",
    ],
    outcomes: [
      "Build & deploy a cross-platform mobile app",
      "Manage app state effectively",
      "Integrate backend APIs & Firebase",
      "Publish apps to Play Store",
    ],
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    slug: "ai-ml",
    icon: "BrainCircuit",
    duration: "16 weeks",
    durationWeeks: 16,
    level: "Advanced",
    description:
      "Dive into machine learning & deep learning with Python. Cover data pipelines, model training, NLP and deployment of ML models.",
    technologies: ["Python", "NumPy", "Pandas", "scikit-learn", "TensorFlow", "PyTorch"],
    syllabusModules: [
      "Python for ML: NumPy, Pandas, Matplotlib",
      "Statistics & probability refresher",
      "Supervised learning algorithms",
      "Unsupervised learning & clustering",
      "Neural networks & deep learning",
      "NLP & computer vision basics",
      "Model evaluation & tuning",
      "Capstone: end-to-end ML project",
    ],
    prerequisites: [
      "Strong Python programming",
      "Basic linear algebra & statistics",
      "Familiarity with data analysis",
    ],
    outcomes: [
      "Train & evaluate ML models",
      "Build deep learning pipelines",
      "Apply NLP/CV to real problems",
      "Deploy ML models as APIs",
    ],
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    slug: "cloud-devops",
    icon: "Cloud",
    duration: "10 weeks",
    durationWeeks: 10,
    level: "Advanced",
    description:
      "Master cloud infrastructure, containerization, CI/CD and observability. Learn AWS core services, Docker, Kubernetes and automated deployment pipelines.",
    technologies: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Terraform", "Linux"],
    syllabusModules: [
      "Linux & shell fundamentals",
      "AWS core services (EC2, S3, IAM, RDS)",
      "Docker containerization",
      "Kubernetes orchestration basics",
      "CI/CD with GitHub Actions",
      "Infrastructure as Code (Terraform)",
      "Monitoring & logging",
      "Capstone: deploy a containerized app",
    ],
    prerequisites: [
      "Comfortable with the command line",
      "Basic networking concepts",
      "Familiarity with any programming language",
    ],
    outcomes: [
      "Provision AWS infrastructure",
      "Containerize apps with Docker",
      "Build CI/CD pipelines",
      "Deploy to Kubernetes clusters",
    ],
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    slug: "ui-ux-design",
    icon: "Palette",
    duration: "8 weeks",
    durationWeeks: 8,
    level: "Beginner",
    description:
      "Learn user-centered design from research to high-fidelity prototypes. Master Figma, design systems, usability testing and handoff to developers.",
    technologies: ["Figma", "Design Systems", "Prototyping", "User Research", "Accessibility"],
    syllabusModules: [
      "Design thinking & UX fundamentals",
      "User research & personas",
      "Wireframing & information architecture",
      "Visual design & typography",
      "Design systems & components",
      "Prototyping in Figma",
      "Usability testing & iteration",
      "Capstone: complete product design",
    ],
    prerequisites: [
      "No prior coding required",
      "An eye for visual detail",
      "A laptop with Figma (free) installed",
    ],
    outcomes: [
      "Design usable, accessible interfaces",
      "Build a Figma design system",
      "Run usability tests",
      "Hand off designs to developers",
    ],
  },
  {
    id: "python-development",
    title: "Python Development",
    slug: "python-development",
    icon: "Cpu",
    duration: "10 weeks",
    durationWeeks: 10,
    level: "Beginner",
    description:
      "Start your programming journey with Python. Cover fundamentals, data structures, OOP, web scraping and an intro to Django/Flask web development.",
    technologies: ["Python", "Django", "Flask", "Requests", "BeautifulSoup", "Git"],
    syllabusModules: [
      "Python syntax & data types",
      "Control flow & functions",
      "Data structures & OOP",
      "File I/O & error handling",
      "Web scraping with Requests/BeautifulSoup",
      "Flask web basics",
      "Intro to Django REST",
      "Capstone: Python web app",
    ],
    prerequisites: [
      "No prior programming experience required",
      "Basic computer literacy",
      "A laptop with Python 3 installed",
    ],
    outcomes: [
      "Write clean, idiomatic Python",
      "Build simple web apps with Flask",
      "Automate tasks & scrape data",
      "Progress to Django/full-stack Python",
    ],
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    slug: "data-analytics",
    icon: "BarChart3",
    duration: "10 weeks",
    durationWeeks: 10,
    level: "Intermediate",
    description:
      "Turn raw data into insights. Learn SQL, Excel, Python (Pandas) and data visualization with Power BI/Tableau to drive business decisions.",
    technologies: ["SQL", "Excel", "Python", "Pandas", "Power BI", "Tableau"],
    syllabusModules: [
      "Data analytics fundamentals",
      "SQL for data querying",
      "Advanced Excel & pivot tables",
      "Python Pandas for data wrangling",
      "Data visualization principles",
      "Power BI dashboards",
      "Intro to Tableau",
      "Capstone: business analytics dashboard",
    ],
    prerequisites: [
      "Basic Excel familiarity",
      "Comfort with numbers",
      "No prior programming required",
    ],
    outcomes: [
      "Query & analyze data with SQL",
      "Build interactive dashboards",
      "Clean & transform messy data",
      "Communicate insights visually",
    ],
  },
];

export function getInternshipDomain(id: string): InternshipDomain | undefined {
  return internshipDomains.find((d) => d.id === id || d.slug === id);
}

/* ------------------------------------------------------------------
 * INTERNSHIP BENEFITS (6)
 * ------------------------------------------------------------------ */

export interface InternshipBenefit {
  icon: string;
  title: string;
  description: string;
}

export const internshipBenefits: InternshipBenefit[] = [
  {
    icon: "Rocket",
    title: "Real Project Experience",
    description:
      "Work on live, production-style projects — not toy exercises. Build a portfolio that actually impresses hiring managers.",
  },
  {
    icon: "Users",
    title: "Industry Mentors",
    description:
      "Get 1:1 guidance from senior engineers at AVM Smart Solutions who ship real products every day.",
  },
  {
    icon: "ClipboardCheck",
    title: "Live Code Reviews",
    description:
      "Receive detailed, constructive feedback on every submission so you improve with each iteration.",
  },
  {
    icon: "Award",
    title: "Certificate of Completion",
    description:
      "Earn a verifiable AVM Smart Solutions certificate with a unique ID that recruiters can validate online.",
  },
  {
    icon: "Briefcase",
    title: "Placement Assistance",
    description:
      "Get resume reviews, mock interviews and referrals to our hiring partner network upon successful completion.",
  },
  {
    icon: "CalendarClock",
    title: "Flexible Schedule",
    description:
      "Choose short-term (8–12 weeks) or long-term (3–6 months) programs. Remote-friendly so you can learn from anywhere.",
  },
];

/* ------------------------------------------------------------------
 * HOW IT WORKS (4 steps)
 * ------------------------------------------------------------------ */

export interface HowItWorksStep {
  step: number;
  icon: string;
  title: string;
  description: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: 1,
    icon: "UserPlus",
    title: "Register",
    description:
      "Create your student account and apply for the internship domain that matches your interests and skill level.",
  },
  {
    step: 2,
    icon: "UserCheck",
    title: "Get Assigned a Mentor",
    description:
      "We match you with an industry mentor from the AVM engineering team based on your chosen domain.",
  },
  {
    step: 3,
    icon: "Code2",
    title: "Learn & Build",
    description:
      "Access learning materials, complete weekly assignments, build projects and get live code reviews.",
  },
  {
    step: 4,
    icon: "Award",
    title: "Get Certified",
    description:
      "Finish your capstone project, earn a verifiable certificate and receive placement assistance.",
  },
];

/* ------------------------------------------------------------------
 * LEARNING / LMS PUBLIC INFO
 * ------------------------------------------------------------------ */

export interface LearningFeature {
  icon: string;
  title: string;
  description: string;
}

export const learningFeatures: LearningFeature[] = [
  {
    icon: "BookOpen",
    title: "Learning Materials",
    description:
      "Structured video lessons, written notes and downloadable code for every module of your internship curriculum.",
  },
  {
    icon: "ClipboardList",
    title: "Assignments",
    description:
      "Weekly hands-on assignments that reinforce concepts and build your project portfolio step by step.",
  },
  {
    icon: "FileQuestion",
    title: "Quizzes & Assessments",
    description:
      "Auto-graded multiple-choice quizzes and coding challenges to test your understanding after each module.",
  },
  {
    icon: "Rocket",
    title: "Projects",
    description:
      "Mini-projects throughout the program and a capstone project that brings everything together into a portfolio piece.",
  },
  {
    icon: "TrendingUp",
    title: "Progress Tracking",
    description:
      "Visual dashboards show lessons completed, assignment grades, quiz scores and overall course progress at a glance.",
  },
];

export const learningExtraFeatures: { icon: string; label: string }[] = [
  { icon: "MessageSquare", label: "Mentor Feedback" },
  { icon: "CalendarDays", label: "Attendance Tracking" },
  { icon: "BadgeCheck", label: "Certificate Generation & Verification" },
  { icon: "Users", label: "Discussion Forums" },
];

export const learningSteps: HowItWorksStep[] = [
  {
    step: 1,
    icon: "BookOpen",
    title: "Access Materials",
    description:
      "Log in to your Student Portal and work through structured video lessons, notes and code samples at your own pace.",
  },
  {
    step: 2,
    icon: "Send",
    title: "Submit Assignments",
    description:
      "Complete weekly hands-on assignments and submit your work — GitHub repos, live links and written answers.",
  },
  {
    step: 3,
    icon: "Award",
    title: "Get Feedback & Certified",
    description:
      "Your mentor reviews submissions, gives detailed feedback, and you earn a verifiable certificate on completion.",
  },
];

/* ------------------------------------------------------------------
 * VISION, MISSION & LEARNING APPROACH (About page)
 * ------------------------------------------------------------------ */

export interface VisionMission {
  icon: string;
  title: string;
  description: string;
}

export const visionMission: VisionMission[] = [
  {
    icon: "Target",
    title: "Our Vision",
    description:
      "To become a trusted internship-to-career platform that empowers students with real-world engineering skills and bridges the gap between academia and industry across India.",
  },
  {
    icon: "Rocket",
    title: "Our Mission",
    description:
      "To bridge the academia-industry gap through mentor-led internships, practical project-based learning and verified certifications that prepare students for real engineering roles.",
  },
];

export const learningApproach: VisionMission[] = [
  {
    icon: "Code2",
    title: "Project-Based Learning",
    description:
      "Every module culminates in a build. You don't just watch tutorials — you ship working software, reviewed by senior engineers.",
  },
  {
    icon: "Users",
    title: "1:1 Mentorship",
    description:
      "Each intern is assigned a dedicated mentor from the AVM engineering team for guidance, code reviews and career advice.",
  },
  {
    icon: "Briefcase",
    title: "Industry-Aligned Curriculum",
    description:
      "Curriculum is designed and updated by engineers shipping production software, so you learn exactly what employers need.",
  },
  {
    icon: "ClipboardCheck",
    title: "Continuous Assessment",
    description:
      "Weekly assignments, quizzes and code reviews keep you on track and give you measurable progress throughout the program.",
  },
];

export interface TeamLeader {
  name: string;
  role: string;
  expertise: string;
  initials: string;
}

export const teamLeadership: TeamLeader[] = [
  {
    name: "A. Anand Raju",
    role: "Founder & CEO",
    expertise: "Full Stack Engineer • YouTube creator, 'Mr Anand Tech'",
    initials: "AA",
  },
  {
    name: "Mahendra Cheerla",
    role: "Co-founder & Technical Lead",
    expertise: "Java, Spring Boot, Microservices, React, Next.js, MySQL",
    initials: "MC",
  },
  {
    name: "B.V. Madhukar",
    role: "Co-founder & Technical Lead",
    expertise: "Senior UI/UX & React Architect",
    initials: "BM",
  },
];

/* ------------------------------------------------------------------
 * INTERNSHIP PAGE — eligibility, includes, program duration
 * ------------------------------------------------------------------ */

export const eligibilityCriteria: string[] = [
  "Students pursuing or recently graduated from BTech / MCA / MSc in CS, IT, ECE or related fields",
  "Basic programming foundation (varies by domain — see prerequisites)",
  "Commitment to complete the full internship duration",
  "Own laptop with the required software installed",
];

export const internshipIncludes: { icon: string; title: string; description: string }[] = [
  { icon: "UserCheck", title: "Mentor Assignment", description: "A dedicated industry mentor guides you through the program." },
  { icon: "BookOpen", title: "Learning Materials", description: "Video lessons, notes and code for every module." },
  { icon: "ClipboardList", title: "Weekly Assignments", description: "Hands-on tasks with mentor code reviews." },
  { icon: "Rocket", title: "Capstone Project", description: "A portfolio-grade project to showcase your skills." },
  { icon: "Award", title: "Certificate", description: "A verifiable certificate of completion with a unique ID." },
  { icon: "FileText", title: "Letter of Recommendation", description: "A personalized LoR for top-performing interns." },
];

export const programDurations: { type: string; duration: string; detail: string }[] = [
  { type: "Short-term", duration: "8–12 weeks", detail: "Intensive focused programs ideal for semester breaks." },
  { type: "Long-term", duration: "3–6 months", detail: "Deep-dive internships with a major capstone project." },
];

/* ------------------------------------------------------------------
 * FAQs (SAMPLE — editable)
 * ------------------------------------------------------------------ */

export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "What are the internship durations?",
    answer:
      "We offer short-term internships (8–12 weeks) and long-term internships (3–6 months). Each domain has a default duration listed on its program card.",
  },
  {
    question: "Do I need prior coding experience?",
    answer:
      "It depends on the domain. Beginner programs like UI/UX Design and Python Development require no prior coding. Intermediate and advanced programs list their prerequisites on the domain detail view.",
  },
  {
    question: "Is the internship paid or unpaid?",
    answer:
      "Our internships are learning-focused and unpaid — the value is in mentorship, real project experience and a verifiable certificate. Top-performing interns may be considered for paid roles at AVM Smart Solutions.",
  },
  {
    question: "Will I get a certificate?",
    answer:
      "Yes. On successful completion of your program and capstone project, you receive an AVM Smart Solutions certificate with a unique verifiable ID that recruiters can validate on our public Verify Certificate page.",
  },
  {
    question: "Can I do it remotely?",
    answer:
      "Yes. All our internship programs are remote-friendly. You can learn and build from anywhere with a laptop and an internet connection.",
  },
  {
    question: "What technologies will I learn?",
    answer:
      "Each domain focuses on a specific technology stack (e.g. MERN, Java/Spring Boot, Flutter, Python/AI-ML, AWS/Docker). See the Technologies chips on each domain card for the full list.",
  },
  {
    question: "How does mentor allocation work?",
    answer:
      "Once you're accepted, we match you with a mentor from the AVM engineering team based on your chosen domain and their expertise. You get 1:1 guidance and live code reviews throughout the program.",
  },
  {
    question: "Is there placement assistance?",
    answer:
      "Yes. On successful completion, you receive resume reviews, mock interviews and referrals to our hiring partner network. We also consider strong performers for roles at AVM Smart Solutions.",
  },
];

/* ------------------------------------------------------------------
 * INTERNSHIP APPLICATION FORM OPTIONS
 * ------------------------------------------------------------------ */

export const educationOptions = [
  { value: "pursuing-btech", label: "Pursuing BTech" },
  { value: "btech-completed", label: "BTech completed" },
  { value: "mca", label: "MCA" },
  { value: "msc", label: "MSc" },
  { value: "other", label: "Other" },
];

export const yearOfStudyOptions = [
  { value: "1st", label: "1st Year" },
  { value: "2nd", label: "2nd Year" },
  { value: "3rd", label: "3rd Year" },
  { value: "4th", label: "4th Year" },
  { value: "graduated", label: "Graduated" },
];

export const programTypeOptions = [
  { value: "short", label: "Short-term (8–12 weeks)" },
  { value: "long", label: "Long-term (3–6 months)" },
];

export const domainOptions = internshipDomains.map((d) => ({
  value: d.id,
  label: d.title,
}));

export const hearAboutOptions = [
  { value: "instagram", label: "Instagram (@avmsmart)" },
  { value: "youtube", label: "YouTube — Mr Anand Tech" },
  { value: "friend", label: "Friend / Referral" },
  { value: "college", label: "College / Faculty" },
  { value: "search", label: "Google Search" },
  { value: "other", label: "Other" },
];

/* ================================================================
 * === STUDENT PORTAL SAMPLE DATA (editable) ===
 * ================================================================ */

export interface StudentInternship {
  id: string;
  domainId: string;
  domainTitle: string;
  mentorName: string;
  startDate: string;
  duration: string;
  progress: number;
  status: "In Progress" | "Completed";
}

// SAMPLE DATA (editable) — the logged-in student's internship enrollments
export const studentInternships: StudentInternship[] = [
  {
    id: "si-1",
    domainId: "mern-fullstack",
    domainTitle: "MERN Full Stack Development",
    mentorName: "Mahendra Cheerla",
    startDate: "2025-09-01",
    duration: "12 weeks",
    progress: 68,
    status: "In Progress",
  },
  {
    id: "si-2",
    domainId: "react-basics-past",
    domainTitle: "React Frontend Fundamentals",
    mentorName: "B.V. Madhukar",
    startDate: "2024-08-15",
    duration: "8 weeks",
    progress: 100,
    status: "Completed",
  },
];

export interface StudentProject {
  id: string;
  title: string;
  type: "Capstone" | "Mini Project";
  domainTitle: string;
  description: string;
  deadline: string;
  status: "Not Started" | "In Progress" | "Submitted" | "Reviewed";
  grade?: string;
}

// SAMPLE DATA (editable) — projects assigned to the logged-in student
export const studentProjects: StudentProject[] = [
  {
    id: "sp-1",
    title: "Full-Stack Task Management SaaS",
    type: "Capstone",
    domainTitle: "MERN Full Stack Development",
    description:
      "Build a multi-tenant task management app with teams, real-time updates, role-based access and a billing-ready landing page. Deploy frontend to Vercel and backend to Render.",
    deadline: "2025-12-20",
    status: "In Progress",
  },
  {
    id: "sp-2",
    title: "JWT Authentication Module",
    type: "Mini Project",
    domainTitle: "MERN Full Stack Development",
    description:
      "Implement a reusable JWT auth module with signup, login, password reset, email verification and refresh tokens. Ship as an npm-installable package.",
    deadline: "2025-11-10",
    status: "Submitted",
    grade: "A",
  },
  {
    id: "sp-3",
    title: "Real-time Chat Widget",
    type: "Mini Project",
    domainTitle: "MERN Full Stack Development",
    description:
      "Build an embeddable real-time chat widget using Socket.io with typing indicators, presence and message history.",
    deadline: "2025-12-05",
    status: "Not Started",
  },
];

/* ================================================================
 * === MENTOR PORTAL SAMPLE DATA (editable) ===
 * ================================================================ */

export interface Mentor {
  id: string;
  name: string;
  email: string;
  expertise: string;
  assignedStudentsCount: number;
  initials: string;
  status: "Active" | "On Leave";
}

// SAMPLE DATA (editable) — mentor directory
export const mentors: Mentor[] = [
  {
    id: "mentor-1",
    name: "Mahendra Cheerla",
    email: "mahendra@avmsmart.in",
    expertise: "Java, Spring Boot, Microservices, React, Next.js",
    assignedStudentsCount: 8,
    initials: "MC",
    status: "Active",
  },
  {
    id: "mentor-2",
    name: "B.V. Madhukar",
    email: "madhukar@avmsmart.in",
    expertise: "Senior UI/UX & React Architecture",
    assignedStudentsCount: 6,
    initials: "BM",
    status: "Active",
  },
  {
    id: "mentor-3",
    name: "Sai Guru Surya Teja",
    email: "surya@avmsmart.in",
    expertise: "MERN & DevOps",
    assignedStudentsCount: 7,
    initials: "ST",
    status: "Active",
  },
  {
    id: "mentor-4",
    name: "Vandana Karanam",
    email: "vandana@avmsmart.in",
    expertise: "MERN & Python",
    assignedStudentsCount: 5,
    initials: "VK",
    status: "Active",
  },
  {
    id: "mentor-5",
    name: "Subhashini Konda",
    email: "subhashini@avmsmart.in",
    expertise: "Full Stack & AI/ML",
    assignedStudentsCount: 9,
    initials: "SK",
    status: "Active",
  },
  {
    id: "mentor-6",
    name: "Telugu Dasari Karthik",
    email: "karthik@avmsmart.in",
    expertise: "Java Full Stack",
    assignedStudentsCount: 6,
    initials: "TK",
    status: "On Leave",
  },
  {
    id: "mentor-7",
    name: "Molakala Murali",
    email: "murali@avmsmart.in",
    expertise: "Data Analytics",
    assignedStudentsCount: 4,
    initials: "MM",
    status: "Active",
  },
];

// The logged-in mentor (SAMPLE)
export const currentMentor: Mentor = mentors[0];

export interface MentorAssignedStudent {
  id: string;
  name: string;
  email: string;
  domain: string;
  progress: number;
  lastActive: string;
  initials: string;
  status: "Active" | "Idle";
}

// SAMPLE DATA (editable) — students assigned to the logged-in mentor
export const mentorAssignedStudents: MentorAssignedStudent[] = [
  { id: "stu-1", name: "Aarav Sharma", email: "aarav@example.com", domain: "MERN Full Stack", progress: 68, lastActive: "2 hours ago", initials: "AS", status: "Active" },
  { id: "stu-2", name: "Priya Reddy", email: "priya@example.com", domain: "MERN Full Stack", progress: 45, lastActive: "1 day ago", initials: "PR", status: "Active" },
  { id: "stu-3", name: "Rahul Verma", email: "rahul@example.com", domain: "Java Full Stack", progress: 82, lastActive: "3 hours ago", initials: "RV", status: "Active" },
  { id: "stu-4", name: "Sneha Iyer", email: "sneha@example.com", domain: "Java Full Stack", progress: 30, lastActive: "5 days ago", initials: "SI", status: "Idle" },
  { id: "stu-5", name: "Karthik Naidu", email: "karthik.n@example.com", domain: "MERN Full Stack", progress: 55, lastActive: "12 hours ago", initials: "KN", status: "Active" },
  { id: "stu-6", name: "Divya Lakshmi", email: "divya@example.com", domain: "React Frontend", progress: 90, lastActive: "1 hour ago", initials: "DL", status: "Active" },
  { id: "stu-7", name: "Arjun Rao", email: "arjun@example.com", domain: "Java Full Stack", progress: 22, lastActive: "1 week ago", initials: "AR", status: "Idle" },
  { id: "stu-8", name: "Meera Joshi", email: "meera@example.com", domain: "MERN Full Stack", progress: 75, lastActive: "6 hours ago", initials: "MJ", status: "Active" },
];

export interface MentorPendingEvaluation {
  id: string;
  studentName: string;
  studentId: string;
  assignmentTitle: string;
  courseTitle: string;
  submittedDate: string;
  status: "Pending" | "Evaluated";
  submissionContent: string;
  maxMarks: number;
  grade?: string;
  feedback?: string;
}

// SAMPLE DATA (editable) — pending assignment evaluations for the logged-in mentor
export const mentorPendingEvaluations: MentorPendingEvaluation[] = [
  {
    id: "eval-1",
    studentName: "Aarav Sharma",
    studentId: "stu-1",
    assignmentTitle: "JWT-Authenticated Note-Taking App",
    courseTitle: "MERN Full Stack Development",
    submittedDate: "2025-11-18",
    status: "Pending",
    submissionContent:
      "Submitted a MERN note app with JWT auth, deployed backend on Render and frontend on Vercel. GitHub: github.com/aarav/notes-app. Includes signup, login, CRUD for notes and protected routes.",
    maxMarks: 100,
  },
  {
    id: "eval-2",
    studentName: "Priya Reddy",
    studentId: "stu-2",
    assignmentTitle: "React Hooks Todo App",
    courseTitle: "MERN Full Stack Development",
    submittedDate: "2025-11-16",
    status: "Pending",
    submissionContent:
      "Built a Todo app using useState, useEffect and useReducer with localStorage persistence and a filter for all/active/completed. Live: priya-todo.vercel.app. Repo: github.com/priya/todo.",
    maxMarks: 50,
  },
  {
    id: "eval-3",
    studentName: "Rahul Verma",
    studentId: "stu-3",
    assignmentTitle: "Build a CRUD REST API for Employee Records",
    courseTitle: "Java Full Stack Development",
    submittedDate: "2025-11-15",
    status: "Pending",
    submissionContent:
      "Spring Boot REST API for Employee resource with GET/POST/PUT/DELETE, JPA persistence, jakarta.validation and a global exception handler. Repo: github.com/rahul/employee-api.",
    maxMarks: 100,
  },
  {
    id: "eval-4",
    studentName: "Karthik Naidu",
    studentId: "stu-5",
    assignmentTitle: "OOP Principles Mini-Project",
    courseTitle: "Java Full Stack Development",
    submittedDate: "2025-11-12",
    status: "Evaluated",
    submissionContent:
      "Java program demonstrating encapsulation, inheritance, polymorphism and abstraction via a small banking example.",
    maxMarks: 50,
    grade: "A",
    feedback: "Great demonstration of all four OOP principles. Clean separation of concerns.",
  },
  {
    id: "eval-5",
    studentName: "Meera Joshi",
    studentId: "stu-8",
    assignmentTitle: "React Hooks Todo App",
    courseTitle: "MERN Full Stack Development",
    submittedDate: "2025-11-10",
    status: "Pending",
    submissionContent:
      "Todo app with useReducer for state, localStorage persistence, drag-and-drop reordering and dark mode. Live: meera-todo.vercel.app.",
    maxMarks: 50,
  },
];

export interface MentorProjectReview {
  id: string;
  studentName: string;
  studentId: string;
  projectTitle: string;
  domainTitle: string;
  repoLink: string;
  demoLink: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Changes Requested";
  rating?: number;
  feedback?: string;
}

// SAMPLE DATA (editable) — capstone projects submitted for review
export const mentorProjectReviews: MentorProjectReview[] = [
  {
    id: "pr-1",
    studentName: "Divya Lakshmi",
    studentId: "stu-6",
    projectTitle: "E-commerce Storefront with Cart",
    domainTitle: "React Frontend Fundamentals",
    repoLink: "github.com/divya/storefront",
    demoLink: "divya-storefront.vercel.app",
    submittedDate: "2025-11-17",
    status: "Pending",
  },
  {
    id: "pr-2",
    studentName: "Aarav Sharma",
    studentId: "stu-1",
    projectTitle: "Full-Stack Task Management SaaS",
    domainTitle: "MERN Full Stack Development",
    repoLink: "github.com/aarav/task-saas",
    demoLink: "task-saas-aarav.vercel.app",
    submittedDate: "2025-11-14",
    status: "Pending",
  },
  {
    id: "pr-3",
    studentName: "Rahul Verma",
    studentId: "stu-3",
    projectTitle: "Employee Management System",
    domainTitle: "Java Full Stack Development",
    repoLink: "github.com/rahul/emp-mgmt",
    demoLink: "emp-mgmt.onrender.com",
    submittedDate: "2025-11-09",
    status: "Approved",
    rating: 5,
    feedback: "Excellent work — clean API design, proper error handling and good test coverage.",
  },
  {
    id: "pr-4",
    studentName: "Priya Reddy",
    studentId: "stu-2",
    projectTitle: "Portfolio Website with CMS",
    domainTitle: "MERN Full Stack Development",
    repoLink: "github.com/priya/portfolio-cms",
    demoLink: "priya-portfolio.vercel.app",
    submittedDate: "2025-11-05",
    status: "Changes Requested",
    rating: 3,
    feedback: "Good start. Please add authentication to the CMS and improve responsive layout on mobile.",
  },
];

/* ================================================================
 * === ADMIN PORTAL SAMPLE DATA (editable) ===
 * ================================================================ */

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  domain: string;
  mentor: string;
  progress: number;
  status: "Active" | "Suspended" | "Completed" | "Pending" | "Rejected";
  initials: string;
  enrolledOn: string;
  phone?: string;
  education?: string;
  yearOfStudy?: string;
}

// SAMPLE DATA (editable) — all students (admin view)
export const adminStudents: AdminStudent[] = [
  { id: "stu-1", name: "Aarav Sharma", email: "aarav@example.com", domain: "MERN Full Stack", mentor: "Mahendra Cheerla", progress: 68, status: "Active", initials: "AS", enrolledOn: "2025-09-01" },
  { id: "stu-2", name: "Priya Reddy", email: "priya@example.com", domain: "MERN Full Stack", mentor: "Mahendra Cheerla", progress: 45, status: "Active", initials: "PR", enrolledOn: "2025-09-05" },
  { id: "stu-3", name: "Rahul Verma", email: "rahul@example.com", domain: "Java Full Stack", mentor: "Mahendra Cheerla", progress: 82, status: "Active", initials: "RV", enrolledOn: "2025-08-20" },
  { id: "stu-4", name: "Sneha Iyer", email: "sneha@example.com", domain: "Java Full Stack", mentor: "Telugu D. Karthik", progress: 30, status: "Active", initials: "SI", enrolledOn: "2025-09-10" },
  { id: "stu-5", name: "Karthik Naidu", email: "karthik.n@example.com", domain: "MERN Full Stack", mentor: "Mahendra Cheerla", progress: 55, status: "Active", initials: "KN", enrolledOn: "2025-09-12" },
  { id: "stu-6", name: "Divya Lakshmi", email: "divya@example.com", domain: "React Frontend", mentor: "B.V. Madhukar", progress: 90, status: "Active", initials: "DL", enrolledOn: "2025-08-15" },
  { id: "stu-7", name: "Arjun Rao", email: "arjun@example.com", domain: "Java Full Stack", mentor: "Telugu D. Karthik", progress: 22, status: "Suspended", initials: "AR", enrolledOn: "2025-09-18" },
  { id: "stu-8", name: "Meera Joshi", email: "meera@example.com", domain: "MERN Full Stack", mentor: "Mahendra Cheerla", progress: 75, status: "Active", initials: "MJ", enrolledOn: "2025-08-28" },
  { id: "stu-9", name: "Vikram Singh", email: "vikram@example.com", domain: "AI & ML", mentor: "Subhashini Konda", progress: 60, status: "Active", initials: "VS", enrolledOn: "2025-08-01" },
  { id: "stu-10", name: "Ananya Gupta", email: "ananya@example.com", domain: "AI & ML", mentor: "Subhashini Konda", progress: 48, status: "Active", initials: "AG", enrolledOn: "2025-08-05" },
  { id: "stu-11", name: "Rohit Desai", email: "rohit@example.com", domain: "Cloud & DevOps", mentor: "Sai Guru Surya Teja", progress: 70, status: "Active", initials: "RD", enrolledOn: "2025-09-03" },
  { id: "stu-12", name: "Ishita Kapoor", email: "ishita@example.com", domain: "Cloud & DevOps", mentor: "Sai Guru Surya Teja", progress: 35, status: "Active", initials: "IK", enrolledOn: "2025-09-08" },
  { id: "stu-13", name: "Naveen Kumar", email: "naveen@example.com", domain: "UI/UX Design", mentor: "B.V. Madhukar", progress: 88, status: "Active", initials: "NK", enrolledOn: "2025-09-15" },
  { id: "stu-14", name: "Pooja Mehta", email: "pooja@example.com", domain: "UI/UX Design", mentor: "B.V. Madhukar", progress: 52, status: "Active", initials: "PM", enrolledOn: "2025-09-20" },
  { id: "stu-15", name: "Sai Teja", email: "saiteja@example.com", domain: "Python Development", mentor: "Vandana Karanam", progress: 40, status: "Active", initials: "ST", enrolledOn: "2025-09-22" },
  { id: "stu-16", name: "Harika Reddy", email: "harika@example.com", domain: "Python Development", mentor: "Vandana Karanam", progress: 65, status: "Active", initials: "HR", enrolledOn: "2025-09-25" },
  { id: "stu-17", name: "Ganesh Patel", email: "ganesh@example.com", domain: "Data Analytics", mentor: "Molakala Murali", progress: 78, status: "Active", initials: "GP", enrolledOn: "2025-09-01" },
  { id: "stu-18", name: "Lakshmi Nair", email: "lakshmi@example.com", domain: "Data Analytics", mentor: "Molakala Murali", progress: 100, status: "Completed", initials: "LN", enrolledOn: "2025-07-15" },
  { id: "stu-19", name: "Manoj Yadav", email: "manoj@example.com", domain: "Mobile (Flutter)", mentor: "Sai Guru Surya Teja", progress: 50, status: "Active", initials: "MY", enrolledOn: "2025-09-11" },
  { id: "stu-20", name: "Sara Khan", email: "sara@example.com", domain: "Mobile (Flutter)", mentor: "Sai Guru Surya Teja", progress: 28, status: "Active", initials: "SK", enrolledOn: "2025-09-14" },
];

export interface AdminInternship {
  id: string;
  title: string;
  duration: string;
  level: string;
  enrolledCount: number;
  active: boolean;
}

// SAMPLE DATA (editable) — internship programs admin view (with enrolled counts)
export const adminInternships: AdminInternship[] = internshipDomains.map((d) => ({
  id: d.id,
  title: d.title,
  duration: d.duration,
  level: d.level,
  enrolledCount: [32, 24, 14, 12, 10, 18, 16, 12][internshipDomains.indexOf(d)] ?? 20,
  active: true,
}));

export interface AdminCourse {
  id: string;
  title: string;
  category: string;
  lessonsCount: number;
  enrolledCount: number;
  status: "Published" | "Draft";
}

// SAMPLE DATA (editable) — LMS courses admin view
export const adminCourses: AdminCourse[] = [
  { id: "c-1", title: "Java Full Stack Development", category: "Programming", lessonsCount: 18, enrolledCount: 24, status: "Published" },
  { id: "c-2", title: "MERN Stack Web Development", category: "Web Development", lessonsCount: 16, enrolledCount: 32, status: "Published" },
  { id: "c-3", title: "Python Full Stack", category: "Programming", lessonsCount: 14, enrolledCount: 18, status: "Published" },
  { id: "c-4", title: "AI / Machine Learning", category: "AI/ML", lessonsCount: 22, enrolledCount: 14, status: "Published" },
  { id: "c-5", title: "React Frontend Fundamentals", category: "Web Development", lessonsCount: 12, enrolledCount: 28, status: "Published" },
  { id: "c-6", title: "DevOps with AWS & Docker", category: "Cloud", lessonsCount: 15, enrolledCount: 0, status: "Draft" },
];

export interface AdminApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  domain: string;
  appliedDate: string;
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected";
  notes?: string;
  education?: string;
}

// SAMPLE DATA (editable) — internship applications (admin view)
export const adminApplications: AdminApplication[] = [
  { id: "app-1", name: "Aditya Verma", email: "aditya@example.com", phone: "+91 9000011122", domain: "MERN Full Stack Development", appliedDate: "2025-11-20", status: "Pending", education: "Pursuing BTech" },
  { id: "app-2", name: "Bhavya Sri", email: "bhavya@example.com", phone: "+91 9000022233", domain: "AI & Machine Learning", appliedDate: "2025-11-19", status: "Pending", education: "BTech completed" },
  { id: "app-3", name: "Charan Tej", email: "charan@example.com", phone: "+91 9000033344", domain: "Java Full Stack Development", appliedDate: "2025-11-18", status: "Reviewed", education: "Pursuing BTech", notes: "Strong Java background." },
  { id: "app-4", name: "Deepika Rao", email: "deepika@example.com", phone: "+91 9000044455", domain: "UI/UX Design", appliedDate: "2025-11-17", status: "Accepted", education: "MCA", notes: "Has a design portfolio." },
  { id: "app-5", name: "Eswar Reddy", email: "eswar@example.com", phone: "+91 9000055566", domain: "Cloud & DevOps", appliedDate: "2025-11-16", status: "Pending", education: "Pursuing BTech" },
  { id: "app-6", name: "Fathima Sheikh", email: "fathima@example.com", phone: "+91 9000066677", domain: "Mobile App Development — Flutter", appliedDate: "2025-11-15", status: "Reviewed", education: "BTech completed" },
  { id: "app-7", name: "Goutham Krishna", email: "goutham@example.com", phone: "+91 9000077788", domain: "Python Development", appliedDate: "2025-11-14", status: "Accepted", education: "MSc" },
  { id: "app-8", name: "Harini Devi", email: "harini@example.com", phone: "+91 9000088899", domain: "Data Analytics", appliedDate: "2025-11-13", status: "Rejected", education: "Pursuing BTech", notes: "Missing prerequisites." },
];

export interface AdminCertificate {
  id: string;
  certificateId: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  status: "Issued" | "Revoked";
}

// SAMPLE DATA (editable) — issued certificates
export const adminCertificates: AdminCertificate[] = [
  { id: "ac-1", certificateId: "AVM-CERT-2024-001", studentName: "Lakshmi Nair", courseTitle: "Data Analytics", issueDate: "2025-10-12", status: "Issued" },
  { id: "ac-2", certificateId: "AVM-CERT-2024-0089", studentName: "Aarav Sharma", courseTitle: "React Frontend Fundamentals", issueDate: "2024-10-22", status: "Issued" },
  { id: "ac-3", certificateId: "AVM-CERT-2025-0142", studentName: "Aarav Sharma", courseTitle: "MERN Stack Web Development", issueDate: "2025-01-15", status: "Issued" },
  { id: "ac-4", certificateId: "AVM-CERT-2025-0156", studentName: "Rahul Verma", courseTitle: "Java Full Stack Development", issueDate: "2025-03-08", status: "Issued" },
  { id: "ac-5", certificateId: "AVM-CERT-2025-0171", studentName: "Divya Lakshmi", courseTitle: "React Frontend Fundamentals", issueDate: "2025-04-22", status: "Issued" },
];

// Certificate generation eligibility — completed students
export const certificateEligibleStudents: { id: string; name: string; course: string }[] = [
  { id: "stu-18", name: "Lakshmi Nair", course: "Data Analytics" },
  { id: "stu-3", name: "Rahul Verma", course: "Java Full Stack Development" },
  { id: "stu-6", name: "Divya Lakshmi", course: "React Frontend Fundamentals" },
];

export interface AdminReportData {
  applicationsPerDomain: { label: string; value: number }[];
  studentsPerDomain: { label: string; value: number }[];
  applicationsOverTime: { label: string; value: number }[];
  completionRates: { label: string; value: number }[];
  certificateStats: { issued: number; revoked: number; total: number };
  mentorPerformance: { name: string; students: number; avgProgress: number }[];
}

// SAMPLE DATA (editable) — admin reports/analytics
export const adminReports: AdminReportData = {
  applicationsPerDomain: [
    { label: "MERN", value: 48 },
    { label: "Java", value: 36 },
    { label: "Flutter", value: 22 },
    { label: "AI/ML", value: 30 },
    { label: "Cloud", value: 18 },
    { label: "UI/UX", value: 26 },
    { label: "Python", value: 32 },
    { label: "Data", value: 20 },
  ],
  studentsPerDomain: [
    { label: "MERN", value: 32 },
    { label: "Java", value: 24 },
    { label: "Flutter", value: 12 },
    { label: "AI/ML", value: 14 },
    { label: "Cloud", value: 10 },
    { label: "UI/UX", value: 18 },
    { label: "Python", value: 16 },
    { label: "Data", value: 12 },
  ],
  applicationsOverTime: [
    { label: "Jun", value: 12 },
    { label: "Jul", value: 18 },
    { label: "Aug", value: 25 },
    { label: "Sep", value: 34 },
    { label: "Oct", value: 41 },
    { label: "Nov", value: 52 },
  ],
  completionRates: [
    { label: "MERN", value: 78 },
    { label: "Java", value: 72 },
    { label: "AI/ML", value: 58 },
    { label: "Cloud", value: 65 },
    { label: "UI/UX", value: 88 },
  ],
  certificateStats: { issued: 156, revoked: 2, total: 158 },
  mentorPerformance: [
    { name: "Mahendra", students: 8, avgProgress: 64 },
    { name: "Madhukar", students: 6, avgProgress: 71 },
    { name: "Subhashini", students: 9, avgProgress: 54 },
    { name: "Surya Teja", students: 7, avgProgress: 60 },
    { name: "Vandana", students: 5, avgProgress: 58 },
  ],
};

/* ================================================================
 * === CERTIFICATE VERIFICATION (public) ===
 * ================================================================ */

export interface VerifiableCertificate {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  issuedBy: string;
  status: "Valid" | "Revoked";
}

// SAMPLE DATA (editable) — pre-seeded valid certificate IDs for the public verify page
export const verifiableCertificates: VerifiableCertificate[] = [
  {
    certificateId: "AVM-CERT-2024-001",
    studentName: "Lakshmi Nair",
    courseTitle: "Data Analytics Internship",
    issueDate: "2025-10-12",
    issuedBy: "AVM Smart Solutions",
    status: "Valid",
  },
  {
    certificateId: "AVM-CERT-2024-0089",
    studentName: "Aarav Sharma",
    courseTitle: "React Frontend Fundamentals",
    issueDate: "2024-10-22",
    issuedBy: "AVM Smart Solutions",
    status: "Valid",
  },
  {
    certificateId: "AVM-CERT-2025-0142",
    studentName: "Aarav Sharma",
    courseTitle: "MERN Stack Web Development",
    issueDate: "2025-01-15",
    issuedBy: "AVM Smart Solutions",
    status: "Valid",
  },
];

export function verifyCertificate(certId: string): VerifiableCertificate | null {
  const found = verifiableCertificates.find(
    (c) => c.certificateId.toLowerCase() === certId.trim().toLowerCase()
  );
  return found ?? null;
}

/* ================================================================
 * === LMS SAMPLE DATA (editable) ===
 * All entries below power the Student Portal (Learning Management
 * System) experience. They are sample/placeholder data meant to be
 * replaced with real backend data when a backend is wired in.
 * ================================================================ */

export interface LMSUser {
  name: string;
  email: string;
  avatarInitials: string;
  role: string;
  enrolledOn: string;
  studentId: string;
  phone?: string;
  education?: string;
  yearOfStudy?: string;
  preferredDomain?: string;
  mentor?: string;
  progress?: number;
  status?: string;
}

// SAMPLE — replace with the real logged-in student record
export const lmsUser: LMSUser = {
  name: "Aarav Sharma",
  email: "aarav.sharma@avmsmartsolutions.com",
  avatarInitials: "AS",
  role: "Student",
  enrolledOn: "2024-08-15",
  studentId: "AVM2024-0142",
  phone: "+91 98765 43210",
  education: "B.Tech Computer Science",
  yearOfStudy: "3rd Year",
  preferredDomain: "MERN Full Stack Development",
  mentor: "Mahendra Cheerla",
  progress: 68,
  status: "Active",
};

export type LMSLessonType = "video" | "reading" | "quiz";

export interface LMSLessonResource {
  name: string;
  type: "pdf" | "code" | "doc" | "link";
}

export interface LMSLesson {
  id: string;
  title: string;
  type: LMSLessonType;
  duration: string;
  completed: boolean;
  content: string;
  resources?: LMSLessonResource[];
}

export interface LMSModule {
  id: string;
  title: string;
  lessons: LMSLesson[];
}

export interface LMSCourse {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  category: "Programming" | "Web Development" | "AI/ML" | "Cloud" | "Design" | "Mobile" | "Data";
  thumbnail: string; // tailwind gradient class
  progress: number; // 0-100
  totalLessons: number;
  completedLessons: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  whatYouWillLearn: string[];
  modules: LMSModule[];
  resources: { name: string; type: LMSLessonResource["type"] }[];
}

export const lmsCourses: LMSCourse[] = [
  {
    id: "avm-java-fullstack",
    title: "Java Full Stack Development",
    slug: "java-fullstack",
    instructor: "Ravi Kumar",
    category: "Programming",
    thumbnail: "from-[#f59e0b] to-[#ef4444]",
    progress: 65,
    totalLessons: 18,
    completedLessons: 12,
    duration: "12 weeks",
    level: "Intermediate",
    description:
      "Master core Java, Spring Boot and REST API development through hands-on modules, real projects and mentor-led reviews.",
    whatYouWillLearn: [
      "Build robust object-oriented Java applications",
      "Design RESTful backend services with Spring Boot",
      "Connect relational databases via JDBC and JPA",
      "Write unit tests with JUnit and ship to production",
    ],
    modules: [
      {
        id: "java-m1",
        title: "Java Fundamentals",
        lessons: [
          {
            id: "java-l1",
            title: "Introduction to Java & JVM",
            type: "video",
            duration: "12:30",
            completed: true,
            content:
              "Java is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible. In this lesson we walk through the Java ecosystem, the role of the JVM, bytecode compilation, and how to set up your local development environment with JDK 17 and an IDE such as IntelliJ IDEA or VS Code. We end with a 'Hello, World!' example and an explanation of the standard project layout.",
          },
          {
            id: "java-l2",
            title: "Variables, Data Types & Operators",
            type: "video",
            duration: "16:45",
            completed: true,
            content:
              "We cover Java's primitive types (int, long, double, boolean, char) versus reference types, type inference with var, and the arithmetic, relational, logical and bitwise operators. You will learn how Java handles memory for primitives (stack) versus objects (heap) and the implications for performance and null safety.",
          },
          {
            id: "java-l3",
            title: "Control Flow & Loops",
            type: "reading",
            duration: "10 min",
            completed: true,
            content:
              "This reading walks through if/else, switch expressions (Java 14+), for, while and do-while loops, plus break and continue. We explain enhanced for-loops for iterating collections and the new pattern matching for switch that simplifies branching logic in modern Java.",
          },
          {
            id: "java-l4",
            title: "Methods & Recursion",
            type: "video",
            duration: "14:20",
            completed: false,
            content:
              "Methods are the building blocks of Java programs. We discuss method signatures, parameter passing (pass-by-value), return types, varargs, method overloading and recursion. The lesson ends with a worked example implementing factorial and fibonacci recursively, and a note on when to prefer iteration.",
          },
        ],
      },
      {
        id: "java-m2",
        title: "OOP & Collections",
        lessons: [
          {
            id: "java-l5",
            title: "Classes, Objects & Constructors",
            type: "video",
            duration: "18:10",
            completed: true,
            content:
              "Object-oriented programming in Java begins with classes and objects. We define classes with fields, constructors and methods, discuss access modifiers (public, private, protected, default), the this keyword, static members and record types introduced in Java 16 for concise data carriers.",
          },
          {
            id: "java-l6",
            title: "Inheritance & Polymorphism",
            type: "video",
            duration: "20:30",
            completed: true,
            content:
              "Inheritance lets us reuse code via extends, while polymorphism lets a single interface represent many forms. We explore single inheritance in Java, the Object superclass, method overriding, the super keyword, and runtime polymorphism through upcasting.",
          },
          {
            id: "java-l7",
            title: "Interfaces & Abstract Classes",
            type: "reading",
            duration: "12 min",
            completed: true,
            content:
              "Interfaces define contracts; abstract classes provide partial implementation. We compare the two, discuss default and static methods in interfaces (Java 8+), sealed classes (Java 17), and how to design clean abstractions that are easy to test and extend.",
          },
          {
            id: "java-l8",
            title: "Collections Framework",
            type: "video",
            duration: "22:15",
            completed: false,
            content:
              "The Java Collections Framework (List, Set, Map, Queue) is core to everyday Java. We walk through ArrayList vs LinkedList, HashSet, TreeSet, HashMap and TreeMap, generics for type safety, and iteration patterns with the Iterator and enhanced for-loop.",
            resources: [
              { name: "Collections Cheatsheet", type: "pdf" },
              { name: "collections-examples.java", type: "code" },
            ],
          },
        ],
      },
      {
        id: "java-m3",
        title: "Spring Boot Basics",
        lessons: [
          {
            id: "java-l9",
            title: "Spring Core & Dependency Injection",
            type: "video",
            duration: "19:40",
            completed: true,
            content:
              "Spring's core feature is dependency injection — wiring components together without hard-coded dependencies. We cover @Component, @Service, @Autowired, constructor injection vs field injection, and bean scopes. You will understand inversion of control and why it leads to testable code.",
          },
          {
            id: "java-l10",
            title: "Bootstrapping a Spring Boot App",
            type: "video",
            duration: "15:25",
            completed: false,
            content:
              "Spring Boot auto-configures much of Spring for you. We scaffold a new project with Spring Initializr, walk through the main class, application.properties, starters, embedded Tomcat, and the actuator for production observability.",
          },
          {
            id: "java-l11",
            title: "Configuration & Profiles",
            type: "reading",
            duration: "9 min",
            completed: false,
            content:
              "Externalized configuration is key to shipping the same artifact across environments. We cover application.yml, @Value, @ConfigurationProperties, profiles for dev/staging/prod, and how to inject secrets safely.",
          },
        ],
      },
      {
        id: "java-m4",
        title: "REST API Development",
        lessons: [
          {
            id: "java-l12",
            title: "Building REST Endpoints",
            type: "video",
            duration: "24:00",
            completed: false,
            content:
              "We build a CRUD REST API for an 'Employee' resource using @RestController, @GetMapping, @PostMapping, @PutMapping and @DeleteMapping. We discuss path variables, request params, request bodies, response codes and content negotiation.",
          },
          {
            id: "java-l13",
            title: "Validation & Exception Handling",
            type: "video",
            duration: "17:35",
            completed: false,
            content:
              "Robust APIs validate input and handle errors gracefully. We use jakarta.validation annotations (@NotNull, @Size, @Email), @ControllerAdvice for global exception handling, and consistent error response bodies.",
            resources: [{ name: "API Design Guidelines", type: "pdf" }],
          },
          {
            id: "java-l14",
            title: "Quiz: Java & Spring Fundamentals",
            type: "quiz",
            duration: "10 min",
            completed: false,
            content:
              "Test your understanding of Java fundamentals, OOP and Spring Boot basics with this short MCQ quiz. You will receive instant feedback and explanations for each answer.",
          },
        ],
      },
      {
        id: "java-m5",
        title: "Capstone Project",
        lessons: [
          {
            id: "java-l15",
            title: "Project Brief & Architecture",
            type: "reading",
            duration: "8 min",
            completed: false,
            content:
              "The capstone project asks you to build a complete backend service for a small e-commerce checkout flow with Spring Boot. We outline the architecture, data model, API contract and deployment plan.",
          },
          {
            id: "java-l16",
            title: "Implementation Walkthrough",
            type: "video",
            duration: "28:50",
            completed: false,
            content:
              "A guided walkthrough of the reference implementation: entities, repositories, services, controllers, validation, exception handling and a few unit tests. Use this as a template for your own solution.",
          },
        ],
      },
    ],
    resources: [
      { name: "Java Cheatsheet (PDF)", type: "pdf" },
      { name: "Spring Boot Starter Template", type: "code" },
      { name: "Course Syllabus", type: "doc" },
    ],
  },
  {
    id: "avm-python-fullstack",
    title: "Python Full Stack",
    slug: "python-fullstack",
    instructor: "Meera Nair",
    category: "Programming",
    thumbnail: "from-[#3b82f6] to-[#22d3ee]",
    progress: 42,
    totalLessons: 17,
    completedLessons: 7,
    duration: "12 weeks",
    level: "Intermediate",
    description:
      "Build versatile full-stack skills with Python, Django/Flask, data handling and automation — covering web, data and DevOps use cases.",
    whatYouWillLearn: [
      "Write clean, idiomatic Python 3 with OOP",
      "Build and deploy Django and Flask web apps",
      "Design REST APIs with Django REST Framework",
      "Process and analyze data with Pandas & NumPy",
    ],
    modules: [
      {
        id: "py-m1",
        title: "Python Foundations",
        lessons: [
          {
            id: "py-l1",
            title: "Python Syntax & First Program",
            type: "video",
            duration: "10:15",
            completed: true,
            content:
              "We introduce Python's readable, indentation-based syntax, dynamic typing and the REPL. You will write your first Python program, install Python 3.12 and set up a virtual environment with venv.",
          },
          {
            id: "py-l2",
            title: "Data Structures: Lists, Tuples, Sets, Dicts",
            type: "video",
            duration: "19:30",
            completed: true,
            content:
              "Python's built-in data structures are the workhorses of every program. We cover list comprehensions, tuple immutability, set operations and dict patterns including defaultdict and Counter from the collections module.",
          },
          {
            id: "py-l3",
            title: "Functions, Lambdas & Decorators",
            type: "reading",
            duration: "11 min",
            completed: true,
            content:
              "Functions in Python are first-class objects. We cover def, lambda, *args and **kwargs, default arguments, type hints, and decorators for cross-cutting concerns like logging and timing.",
          },
          {
            id: "py-l4",
            title: "Modules, Packages & Imports",
            type: "video",
            duration: "13:20",
            completed: false,
            content:
              "We organize code into modules and packages. We discuss the import system, __init__.py, relative vs absolute imports, pip for dependencies and how to structure a Python project for reuse.",
          },
        ],
      },
      {
        id: "py-m2",
        title: "OOP & File I/O",
        lessons: [
          {
            id: "py-l5",
            title: "Classes & Objects in Python",
            type: "video",
            duration: "16:40",
            completed: true,
            content:
              "Python's OOP model uses classes, instances, __init__, self, inheritance and dunder methods. We also cover dataclasses (Python 3.7+) for boilerplate-free data containers and typing.Protocol for structural typing.",
          },
          {
            id: "py-l6",
            title: "Working with Files & CSV/JSON",
            type: "video",
            duration: "14:55",
            completed: true,
            content:
              "Reading and writing files is foundational. We use the built-in open, context managers (with statement), pathlib for path handling, and the csv and json modules for structured data.",
          },
          {
            id: "py-l7",
            title: "Exceptions & Error Handling",
            type: "reading",
            duration: "8 min",
            completed: false,
            content:
              "We cover try/except/else/finally, raising exceptions, custom exception classes, and best practices for graceful error handling and logging in Python services.",
          },
        ],
      },
      {
        id: "py-m3",
        title: "Web with Flask & Django",
        lessons: [
          {
            id: "py-l8",
            title: "Flask Fundamentals",
            type: "video",
            duration: "20:10",
            completed: false,
            content:
              "Flask is a lightweight WSGI web framework. We build a small REST API with routes, JSON responses, request parsing, blueprints for structure and templates with Jinja2.",
          },
          {
            id: "py-l9",
            title: "Django App Structure",
            type: "video",
            duration: "22:45",
            completed: false,
            content:
              "Django is a batteries-included web framework. We scaffold a project, create an app, define models with the Django ORM, run migrations, and wire views + URLs + templates together.",
          },
          {
            id: "py-l10",
            title: "Django REST Framework",
            type: "video",
            duration: "18:30",
            completed: false,
            content:
              "Django REST Framework (DRF) adds serialization, viewsets, routers and authentication to Django. We build a clean REST API with serializers, ModelViewSet and token auth.",
            resources: [
              { name: "DRF Cheatsheet", type: "pdf" },
              { name: "drf-demo-project.zip", type: "code" },
            ],
          },
        ],
      },
      {
        id: "py-m4",
        title: "Data Handling & Automation",
        lessons: [
          {
            id: "py-l11",
            title: "NumPy & Pandas Essentials",
            type: "video",
            duration: "25:00",
            completed: false,
            content:
              "NumPy provides fast n-dimensional arrays; Pandas adds labeled DataFrames. We cover array operations, indexing, filtering, groupby aggregations and merging DataFrames — the core of data analysis in Python.",
          },
          {
            id: "py-l12",
            title: "Automation Scripts & Cron",
            type: "reading",
            duration: "10 min",
            completed: false,
            content:
              "We build small automation scripts (file renaming, web scraping with requests/BeautifulSoup, sending emails) and schedule them with cron on Linux and Task Scheduler on Windows.",
          },
          {
            id: "py-l13",
            title: "Quiz: Python Web & Data",
            type: "quiz",
            duration: "8 min",
            completed: false,
            content:
              "A short MCQ quiz covering Python OOP, Flask/Django basics and Pandas fundamentals to consolidate your learning before the capstone.",
          },
        ],
      },
    ],
    resources: [
      { name: "Python Cheatsheet (PDF)", type: "pdf" },
      { name: "Django Project Template", type: "code" },
      { name: "Pandas Recipes", type: "doc" },
    ],
  },
  {
    id: "avm-mern-stack",
    title: "MERN Stack Web Development",
    slug: "mern-stack",
    instructor: "Arjun Reddy",
    category: "Web Development",
    thumbnail: "from-[#22c55e] to-[#10b981]",
    progress: 78,
    totalLessons: 19,
    completedLessons: 15,
    duration: "16 weeks",
    level: "Advanced",
    description:
      "The flagship full-stack JavaScript program — MongoDB, Express, React and Node.js — to architect, build and deploy modern web apps end-to-end.",
    whatYouWillLearn: [
      "Architect full-stack MERN applications",
      "Design secure JWT-authenticated REST APIs",
      "Build component-driven React UIs with hooks",
      "Deploy apps to the cloud with CI/CD",
    ],
    modules: [
      {
        id: "mern-m1",
        title: "Modern JavaScript & TypeScript",
        lessons: [
          {
            id: "mern-l1",
            title: "ES6+ Features Deep Dive",
            type: "video",
            duration: "21:30",
            completed: true,
            content:
              "Modern JavaScript (ES6+) is the foundation of every MERN app. We cover let/const, arrow functions, template literals, destructuring, spread/rest, modules (import/export), Promises and async/await.",
          },
          {
            id: "mern-l2",
            title: "TypeScript for JS Developers",
            type: "video",
            duration: "19:50",
            completed: true,
            content:
              "TypeScript adds static typing to JavaScript. We cover basic types, interfaces, generics, union/intersection types, type narrowing, and how to migrate a JS file to TS incrementally.",
          },
          {
            id: "mern-l3",
            title: "Tooling: Node, npm, Vite",
            type: "reading",
            duration: "9 min",
            completed: true,
            content:
              "We set up Node.js 20, npm vs pnpm vs yarn, package.json scripts, Vite for fast dev builds, and tsconfig.json basics. This toolchain powers the rest of the course.",
          },
        ],
      },
      {
        id: "mern-m2",
        title: "Node.js & Express Backend",
        lessons: [
          {
            id: "mern-l4",
            title: "Node.js Runtime & Event Loop",
            type: "video",
            duration: "17:20",
            completed: true,
            content:
              "Node.js runs JS outside the browser using the V8 engine. We explain the event loop, the libuv thread pool, asynchronous I/O, streams and buffers, and when Node excels (I/O-bound) vs when it struggles (CPU-bound).",
          },
          {
            id: "mern-l5",
            title: "Building REST APIs with Express",
            type: "video",
            duration: "23:40",
            completed: true,
            content:
              "Express is the de facto Node web framework. We build a JSON REST API with routers, middleware (logging, CORS, body parsing), controllers, error handling and request validation with zod.",
          },
          {
            id: "mern-l6",
            title: "JWT Authentication",
            type: "video",
            duration: "18:15",
            completed: true,
            content:
              "We implement stateless authentication with JSON Web Tokens: signing tokens on login, protecting routes with auth middleware, refresh tokens, and security best practices (httpOnly cookies, expiry, rotation).",
            resources: [
              { name: "JWT Auth Flow Diagram", type: "pdf" },
              { name: "express-auth-starter.zip", type: "code" },
            ],
          },
          {
            id: "mern-l7",
            title: "Middleware & Error Handling",
            type: "reading",
            duration: "10 min",
            completed: true,
            content:
              "We discuss middleware chains, the next() function, async wrapper for error propagation, custom error classes and a global error handler that returns consistent API error responses.",
          },
        ],
      },
      {
        id: "mern-m3",
        title: "MongoDB & Data Modeling",
        lessons: [
          {
            id: "mern-l8",
            title: "MongoDB Basics & CRUD",
            type: "video",
            duration: "16:30",
            completed: true,
            content:
              "MongoDB is a document database. We cover collections, documents, BSON types, CRUD with the mongo shell, query operators ($gt, $in, $and) and projection.",
          },
          {
            id: "mern-l9",
            title: "Modeling with Mongoose",
            type: "video",
            duration: "20:25",
            completed: true,
            content:
              "Mongoose is the most popular ODM for Node + MongoDB. We define schemas, models, virtuals, validators, indexes, population (joins) and middleware hooks (pre/post save).",
          },
          {
            id: "mern-l10",
            title: "Schema Design Patterns",
            type: "reading",
            duration: "12 min",
            completed: false,
            content:
              "We walk through schema design trade-offs: embedding vs referencing, the subset pattern, the outlier pattern, and how to model one-to-many and many-to-many relations in MongoDB.",
          },
        ],
      },
      {
        id: "mern-m4",
        title: "React Frontend",
        lessons: [
          {
            id: "mern-l11",
            title: "React Components & Props",
            type: "video",
            duration: "18:45",
            completed: true,
            content:
              "React components are the UI building blocks. We cover function components, JSX, props, children, conditional rendering, lists & keys, and component composition patterns.",
          },
          {
            id: "mern-l12",
            title: "Hooks: useState & useEffect",
            type: "video",
            duration: "22:10",
            completed: true,
            content:
              "Hooks bring state and side-effects to function components. We cover useState, useEffect (and its dependency array pitfall), useRef, useMemo, useCallback and a brief look at useReducer.",
          },
          {
            id: "mern-l13",
            title: "Client Routing & Data Fetching",
            type: "video",
            duration: "19:00",
            completed: false,
            content:
              "We add client-side routing with React Router, fetch data from the Express API, handle loading and error states, and discuss patterns like SWR and React Query for caching.",
            resources: [{ name: "React Hooks Cheatsheet", type: "pdf" }],
          },
          {
            id: "mern-l14",
            title: "Forms & Validation",
            type: "reading",
            duration: "11 min",
            completed: false,
            content:
              "We build controlled forms, validate input client-side, display field-level errors, and submit to the API. We also touch react-hook-form and zod for schema-driven forms.",
          },
        ],
      },
      {
        id: "mern-m5",
        title: "Integration & Deployment",
        lessons: [
          {
            id: "mern-l15",
            title: "Full-Stack Integration",
            type: "video",
            duration: "26:40",
            completed: false,
            content:
              "We connect the React frontend to the Express+Mongo backend end-to-end: auth flow, protected routes, CRUD operations, optimistic UI updates, and CORS configuration.",
          },
          {
            id: "mern-l16",
            title: "CI/CD & Cloud Deployment",
            type: "video",
            duration: "21:15",
            completed: false,
            content:
              "We deploy the MERN stack: backend to Render/Railway, frontend to Vercel, MongoDB Atlas for the database, GitHub Actions for CI (lint, test, build) and environment-based config.",
            resources: [
              { name: "Deployment Runbook", type: "pdf" },
              { name: "ci-cd-workflow.yml", type: "code" },
            ],
          },
          {
            id: "mern-l17",
            title: "Quiz: Full-Stack Concepts",
            type: "quiz",
            duration: "12 min",
            completed: false,
            content:
              "A consolidation quiz covering Node/Express, MongoDB/Mongoose, React hooks and full-stack integration patterns.",
          },
          {
            id: "mern-l18",
            title: "Capstone: Build & Ship an App",
            type: "video",
            duration: "30:00",
            completed: false,
            content:
              "The capstone asks you to ship a deployed MERN app (a small project tracker with auth, CRUD and a dashboard). This lesson walks through the reference solution end-to-end.",
          },
          {
            id: "mern-l19",
            title: "Portfolio & Next Steps",
            type: "reading",
            duration: "7 min",
            completed: false,
            content:
              "We wrap up with portfolio advice, interview prep tips for full-stack roles, and recommended next steps (Next.js, testing, performance).",
          },
        ],
      },
    ],
    resources: [
      { name: "MERN Starter Repo", type: "code" },
      { name: "API Design Guide", type: "pdf" },
      { name: "Deployment Checklist", type: "doc" },
    ],
  },
  {
    id: "avm-ai-ml",
    title: "AI / Machine Learning",
    slug: "ai-ml",
    instructor: "Dr. Priya Iyer",
    category: "AI/ML",
    thumbnail: "from-[#a855f7] to-[#6366f1]",
    progress: 20,
    totalLessons: 18,
    completedLessons: 4,
    duration: "16 weeks",
    level: "Advanced",
    description:
      "From math foundations to deployed deep learning models — build, train and ship intelligent features end-to-end with Python, scikit-learn and PyTorch.",
    whatYouWillLearn: [
      "Apply supervised & unsupervised learning algorithms",
      "Train and evaluate deep neural networks with PyTorch",
      "Use NLP techniques on text data",
      "Deploy ML models behind REST APIs",
    ],
    modules: [
      {
        id: "aiml-m1",
        title: "Math Foundations",
        lessons: [
          {
            id: "aiml-l1",
            title: "Linear Algebra Refresher",
            type: "video",
            duration: "20:00",
            completed: true,
            content:
              "We cover vectors, matrices, dot products, matrix multiplication, transposes, inverses and eigenvalues — the linear algebra primitives that underpin every ML algorithm.",
          },
          {
            id: "aiml-l2",
            title: "Probability & Statistics",
            type: "video",
            duration: "22:30",
            completed: true,
            content:
              "We review probability distributions (normal, binomial), expectation, variance, Bayes' theorem, sampling, hypothesis testing and confidence intervals — the statistical lens for evaluating ML models.",
          },
          {
            id: "aiml-l3",
            title: "Calculus for ML",
            type: "reading",
            duration: "13 min",
            completed: true,
            content:
              "We review derivatives, partial derivatives, the chain rule and gradients — the math that powers gradient descent and backpropagation in neural networks.",
          },
          {
            id: "aiml-l4",
            title: "Python for ML: NumPy & Pandas",
            type: "video",
            duration: "18:20",
            completed: false,
            content:
              "We use NumPy for vectorized math and Pandas for tabular data wrangling. This lesson covers array operations, broadcasting, DataFrames and feature preparation pipelines.",
          },
        ],
      },
      {
        id: "aiml-m2",
        title: "Supervised Learning",
        lessons: [
          {
            id: "aiml-l5",
            title: "Linear & Logistic Regression",
            type: "video",
            duration: "19:40",
            completed: false,
            content:
              "We start supervised learning with linear regression (continuous targets) and logistic regression (binary classification). We fit models with scikit-learn, interpret coefficients and discuss regularization (L1, L2).",
          },
          {
            id: "aiml-l6",
            title: "Decision Trees & Random Forests",
            type: "video",
            duration: "21:15",
            completed: false,
            content:
              "Decision trees partition feature space; random forests average many trees for robustness. We train and visualize trees, control overfitting with max_depth, and compare with gradient boosting.",
          },
          {
            id: "aiml-l7",
            title: "Model Evaluation & Tuning",
            type: "reading",
            duration: "11 min",
            completed: false,
            content:
              "We cover train/test splits, cross-validation, metrics (accuracy, precision, recall, F1, ROC-AUC), confusion matrices, and hyperparameter tuning with GridSearchCV and RandomizedSearchCV.",
          },
        ],
      },
      {
        id: "aiml-m3",
        title: "Unsupervised & Deep Learning",
        lessons: [
          {
            id: "aiml-l8",
            title: "Clustering & Dimensionality Reduction",
            type: "video",
            duration: "17:50",
            completed: false,
            content:
              "Unsupervised learning finds structure without labels. We use K-Means and DBSCAN for clustering, PCA for dimensionality reduction and t-SNE for visualization.",
          },
          {
            id: "aiml-l9",
            title: "Neural Networks with PyTorch",
            type: "video",
            duration: "26:10",
            completed: false,
            content:
              "We introduce deep learning with PyTorch: tensors, autograd, defining a Module, the training loop (forward, loss, backward, step), and a simple feedforward network on MNIST.",
            resources: [{ name: "PyTorch Tutorial Notebook", type: "code" }],
          },
          {
            id: "aiml-l10",
            title: "CNNs for Image Data",
            type: "video",
            duration: "24:35",
            completed: false,
            content:
              "Convolutional Neural Networks excel at image tasks. We cover convolution, pooling, receptive fields, build a small CNN with PyTorch and train on CIFAR-10.",
          },
        ],
      },
      {
        id: "aiml-m4",
        title: "NLP & Deployment",
        lessons: [
          {
            id: "aiml-l11",
            title: "Text Processing & Embeddings",
            type: "video",
            duration: "19:25",
            completed: false,
            content:
              "We cover tokenization, stopword removal, TF-IDF and word embeddings (word2vec, GloVe), and introduce transformers at a high level for modern NLP.",
          },
          {
            id: "aiml-l12",
            title: "Deploying Models as APIs",
            type: "video",
            duration: "16:40",
            completed: false,
            content:
              "We wrap a trained scikit-learn/PyTorch model behind a FastAPI service, containerize it with Docker, and discuss model versioning, monitoring and A/B testing.",
          },
          {
            id: "aiml-l13",
            title: "Quiz: ML Concepts",
            type: "quiz",
            duration: "10 min",
            completed: false,
            content:
              "A consolidation quiz on supervised/unsupervised learning, evaluation metrics and deep learning fundamentals.",
          },
        ],
      },
    ],
    resources: [
      { name: "Math Cheatsheet (PDF)", type: "pdf" },
      { name: "PyTorch Starter Notebook", type: "code" },
      { name: "Model Deployment Guide", type: "doc" },
    ],
  },
  {
    id: "avm-cloud-devops",
    title: "Cloud & DevOps Engineering",
    slug: "cloud-devops",
    instructor: "Sai Guru Surya Teja",
    category: "Cloud",
    thumbnail: "from-[#0ea5e9] to-[#6366f1]",
    progress: 0,
    totalLessons: 14,
    completedLessons: 0,
    duration: "10 weeks",
    level: "Advanced",
    description:
      "Master cloud infrastructure, containerization, automated CI/CD pipelines, and observability with AWS, Docker, Kubernetes and GitHub Actions.",
    whatYouWillLearn: [
      "Provision and configure core AWS cloud infrastructure",
      "Containerize microservices and applications with Docker",
      "Build automated CI/CD delivery pipelines with GitHub Actions",
      "Deploy, scale and manage workloads in Kubernetes clusters",
    ],
    modules: [
      {
        id: "cloud-m1",
        title: "Linux & Cloud Infrastructure",
        lessons: [
          {
            id: "cloud-l1",
            title: "Linux Shell & Automation",
            type: "video",
            duration: "18:20",
            completed: false,
            content: "Linux command line, bash scripting, permission models, SSH configuration, and system service management.",
          },
          {
            id: "cloud-l2",
            title: "AWS Core: EC2, S3, IAM & VPC",
            type: "video",
            duration: "24:10",
            completed: false,
            content: "Deep dive into AWS fundamentals: spinning up EC2 instances, configuring IAM least-privilege policies, S3 buckets, and custom VPC networking.",
          },
        ],
      },
      {
        id: "cloud-m2",
        title: "Docker Containerization",
        lessons: [
          {
            id: "cloud-l3",
            title: "Containerizing Apps with Docker",
            type: "video",
            duration: "22:45",
            completed: false,
            content: "Writing multi-stage Dockerfiles, image optimization, layer caching, volume persistence, and multi-container Docker Compose.",
          },
          {
            id: "cloud-l4",
            title: "CI/CD with GitHub Actions",
            type: "reading",
            duration: "15 min",
            completed: false,
            content: "Designing automated build, test, and container push pipelines triggered on git push with secrets management.",
          },
        ],
      },
      {
        id: "cloud-m3",
        title: "Kubernetes & Deployment",
        lessons: [
          {
            id: "cloud-l5",
            title: "Kubernetes Deployments & Services",
            type: "video",
            duration: "28:30",
            completed: false,
            content: "Pods, Deployments, ClusterIP vs NodePort vs Ingress, ConfigMaps, and zero-downtime rolling updates on AWS EKS.",
          },
        ],
      },
    ],
    resources: [
      { name: "AWS Architecture Guide (PDF)", type: "pdf" },
      { name: "Dockerfile Templates", type: "code" },
      { name: "Kubernetes Manifests Pack", type: "code" },
    ],
  },
  {
    id: "avm-ui-ux",
    title: "UI/UX Design & Prototyping",
    slug: "ui-ux-design",
    instructor: "B.V. Madhukar",
    category: "Design",
    thumbnail: "from-[#ec4899] to-[#8b5cf6]",
    progress: 0,
    totalLessons: 12,
    completedLessons: 0,
    duration: "8 weeks",
    level: "Beginner",
    description:
      "Learn user-centered design from research and wireframing to high-fidelity clickable prototypes in Figma and comprehensive design systems.",
    whatYouWillLearn: [
      "Conduct user interviews and design user personas",
      "Build responsive components with Figma Auto-Layout & Variables",
      "Create realistic interactive prototypes and animations",
      "Establish accessible design systems and developer handoff specs",
    ],
    modules: [
      {
        id: "design-m1",
        title: "UX Research & Wireframing",
        lessons: [
          {
            id: "design-l1",
            title: "Design Thinking & Problem Framing",
            type: "video",
            duration: "16:40",
            completed: false,
            content: "Empathy mapping, user journey mapping, information architecture, and low-fidelity paper wireframes.",
          },
          {
            id: "design-l2",
            title: "Figma Fundamentals & Auto-Layout",
            type: "video",
            duration: "25:15",
            completed: false,
            content: "Mastering frames, constraints, nested auto-layout, typography hierarchies, and color token systems.",
          },
        ],
      },
      {
        id: "design-m2",
        title: "High-Fidelity Prototyping",
        lessons: [
          {
            id: "design-l3",
            title: "Interactive Components & Smart Animate",
            type: "video",
            duration: "21:00",
            completed: false,
            content: "Building interactive state variants (hover, active, disabled) and complex animations with Figma Smart Animate.",
          },
          {
            id: "design-l4",
            title: "Design System & Dev Handoff",
            type: "reading",
            duration: "12 min",
            completed: false,
            content: "Publishing Figma team libraries, documenting component tokens, and delivering inspection-ready handoffs to developers.",
          },
        ],
      },
    ],
    resources: [
      { name: "Figma Design System UI Kit", type: "code" },
      { name: "UX Persona Worksheets", type: "pdf" },
      { name: "Accessibility Checklist (WCAG)", type: "doc" },
    ],
  },
  {
    id: "avm-mobile-flutter",
    title: "Mobile App Development (Flutter & Dart)",
    slug: "mobile-flutter",
    instructor: "Sai Guru Surya Teja",
    category: "Mobile",
    thumbnail: "from-[#06b6d4] to-[#3b82f6]",
    progress: 0,
    totalLessons: 14,
    completedLessons: 0,
    duration: "10 weeks",
    level: "Intermediate",
    description:
      "Build high-performance, native cross-platform mobile apps for iOS and Android using Google's Flutter framework and Dart.",
    whatYouWillLearn: [
      "Write modern object-oriented Dart code with async streams",
      "Build pixel-perfect Flutter UI with Material 3 & Cupertino widgets",
      "Manage app-wide state with Provider and Riverpod",
      "Connect REST APIs, Firebase Auth, Firestore, and push notifications",
    ],
    modules: [
      {
        id: "flutter-m1",
        title: "Dart & Flutter Essentials",
        lessons: [
          {
            id: "flutter-l1",
            title: "Dart Language Fundamentals",
            type: "video",
            duration: "19:40",
            completed: false,
            content: "Sound null safety, collections, async/await, Streams, classes, mixins, and factory constructors.",
          },
          {
            id: "flutter-l2",
            title: "Widget Tree & Responsive Layouts",
            type: "video",
            duration: "26:10",
            completed: false,
            content: "Stateless vs Stateful widgets, Scaffold, Column, Row, LayoutBuilder, and adaptive styling for mobile screens.",
          },
        ],
      },
      {
        id: "flutter-m2",
        title: "State Management & Network APIs",
        lessons: [
          {
            id: "flutter-l3",
            title: "State Management with Provider",
            type: "video",
            duration: "24:30",
            completed: false,
            content: "ChangeNotifier, Consumer, Provider tree architecture, and separating UI presentation from business logic.",
          },
          {
            id: "flutter-l4",
            title: "REST APIs & JSON Serialization",
            type: "reading",
            duration: "15 min",
            completed: false,
            content: "HTTP client requests, handling error states, caching responses, and parsing complex nested JSON models.",
          },
        ],
      },
    ],
    resources: [
      { name: "Flutter Architecture Boilerplate", type: "code" },
      { name: "Dart Cheatsheet (PDF)", type: "pdf" },
      { name: "Play Store Release Runbook", type: "doc" },
    ],
  },
  {
    id: "avm-data-analytics",
    title: "Data Analytics & Business Intelligence",
    slug: "data-analytics",
    instructor: "Molakala Murali",
    category: "Data",
    thumbnail: "from-[#10b981] to-[#059669]",
    progress: 0,
    totalLessons: 14,
    completedLessons: 0,
    duration: "8 weeks",
    level: "Beginner",
    description:
      "Transform messy business data into actionable visual insights using SQL, Python (Pandas/NumPy), and interactive Power BI dashboards.",
    whatYouWillLearn: [
      "Master analytical SQL: Window functions, CTEs, and complex joins",
      "Clean, manipulate, and aggregate tabular datasets with Pandas",
      "Design executive Power BI dashboards with DAX measures",
      "Tell compelling data stories that drive business decisions",
    ],
    modules: [
      {
        id: "da-m1",
        title: "SQL & Relational Analysis",
        lessons: [
          {
            id: "da-l1",
            title: "Advanced SQL Queries & Window Functions",
            type: "video",
            duration: "22:10",
            completed: false,
            content: "ROW_NUMBER, RANK, DENSE_RANK, LAG/LEAD, running totals, Common Table Expressions, and query optimization.",
          },
          {
            id: "da-l2",
            title: "Data Wrangling with Python Pandas",
            type: "video",
            duration: "27:40",
            completed: false,
            content: "DataFrames, handling null values, groupby aggregations, pivot tables, merging datasets, and date parsing.",
          },
        ],
      },
      {
        id: "da-m2",
        title: "Business Intelligence & Dashboards",
        lessons: [
          {
            id: "da-l3",
            title: "Power BI Data Modeling & DAX",
            type: "video",
            duration: "25:50",
            completed: false,
            content: "Star schema data modeling, calculated columns, DAX measures (CALCULATE, FILTER, time intelligence), and drill-through filters.",
          },
          {
            id: "da-l4",
            title: "Interactive Storytelling & Reporting",
            type: "reading",
            duration: "10 min",
            completed: false,
            content: "Color palettes for data viz, KPI cards, visual hierarchy, and publishing live reports to Power BI Service.",
          },
        ],
      },
    ],
    resources: [
      { name: "SQL Query Master Pack", type: "code" },
      { name: "Sample Business Datasets (CSV)", type: "code" },
      { name: "Power BI Dashboard Template (.pbix)", type: "doc" },
    ],
  },
];

export type LMSAssignmentStatus = "pending" | "submitted" | "graded" | "overdue";

export interface LMSAssignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  dueDate: string;
  status: LMSAssignmentStatus;
  grade?: string;
  description: string;
  maxMarks: number;
}

// SAMPLE — replace with backend-sourced assignments
export const lmsAssignments: LMSAssignment[] = [
  {
    id: "asg-1",
    courseId: "avm-java-fullstack",
    courseTitle: "Java Full Stack Development",
    title: "Build a CRUD REST API for Employee Records",
    dueDate: "2026-12-05",
    status: "pending",
    description:
      "Implement a Spring Boot REST API for an Employee resource supporting GET (list + by id), POST (create), PUT (update), and DELETE. Use JPA for persistence, validate input with jakarta.validation, and add a global exception handler. Submit your GitHub repo link and a short README.",
    maxMarks: 100,
  },
  {
    id: "asg-2",
    courseId: "avm-mern-stack",
    courseTitle: "MERN Stack Web Development",
    title: "JWT-Authenticated Note-Taking App",
    dueDate: "2026-12-10",
    status: "pending",
    description:
      "Build a small MERN app where users sign up, log in with JWT, and create/edit/delete private notes. Use Express + MongoDB + React. Deploy the backend to Render and frontend to Vercel, then submit both live URLs and the repo.",
    maxMarks: 100,
  },
  {
    id: "asg-3",
    courseId: "avm-python-fullstack",
    courseTitle: "Python Full Stack",
    title: "Django REST API for a Blog",
    dueDate: "2026-11-28",
    status: "overdue",
    description:
      "Create a Django REST Framework API for a blog: Posts, Comments and Authors endpoints, with token authentication and permissions. Submit your GitHub repo link with a populated README and Postman collection.",
    maxMarks: 100,
  },
  {
    id: "asg-4",
    courseId: "avm-ai-ml",
    courseTitle: "AI / Machine Learning",
    title: "Predict House Prices with Linear Regression",
    dueDate: "2026-12-18",
    status: "submitted",
    description:
      "Use scikit-learn to train a linear regression model on a housing dataset (provided). Submit a Jupyter notebook with EDA, feature engineering, model training, evaluation (RMSE, R2) and a brief write-up of your findings.",
    maxMarks: 100,
  },
  {
    id: "asg-5",
    courseId: "avm-java-fullstack",
    courseTitle: "Java Full Stack Development",
    title: "OOP Principles Mini-Project",
    dueDate: "2026-11-15",
    status: "submitted",
    description:
      "Design a small Java program demonstrating the four OOP principles — encapsulation, inheritance, polymorphism and abstraction. Submit a single .zip with source and a short README explaining where each principle appears.",
    maxMarks: 50,
  },
  {
    id: "asg-6",
    courseId: "avm-mern-stack",
    courseTitle: "MERN Stack Web Development",
    title: "React Hooks Todo App",
    dueDate: "2026-11-01",
    status: "graded",
    grade: "A",
    description:
      "Build a Todo app with React using useState, useEffect and useReducer. Add localStorage persistence and a filter for all/active/completed. Submit your repo and a Vercel deployment link.",
    maxMarks: 50,
  },
];

export interface LMSQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface LMSQuiz {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  totalQuestions: number;
  duration: string;
  status: "available" | "completed";
  score?: number;
  questions: LMSQuizQuestion[];
}

// SAMPLE — quiz question banks
export const lmsQuizzes: LMSQuiz[] = [
  {
    id: "quiz-java-1",
    courseId: "avm-java-fullstack",
    courseTitle: "Java Full Stack Development",
    title: "Java & Spring Boot Fundamentals",
    totalQuestions: 4,
    duration: "10 min",
    status: "available",
    questions: [
      {
        id: "q-java-1",
        question: "Which keyword is used to inherit a class in Java?",
        options: ["extends", "implements", "inherits", "super"],
        correctIndex: 0,
      },
      {
        id: "q-java-2",
        question: "Which of these is NOT a primitive type in Java?",
        options: ["int", "boolean", "String", "char"],
        correctIndex: 2,
      },
      {
        id: "q-java-3",
        question: "In Spring Boot, which annotation marks a class as a REST controller?",
        options: ["@Component", "@RestController", "@Service", "@Bean"],
        correctIndex: 1,
      },
      {
        id: "q-java-4",
        question: "Which collection allows duplicate elements and maintains insertion order?",
        options: ["HashSet", "TreeSet", "ArrayList", "HashMap"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "quiz-mern-1",
    courseId: "avm-mern-stack",
    courseTitle: "MERN Stack Web Development",
    title: "Full-Stack JavaScript Concepts",
    totalQuestions: 5,
    duration: "12 min",
    status: "completed",
    score: 80,
    questions: [
      {
        id: "q-mern-1",
        question: "What does MERN stand for?",
        options: [
          "MySQL, Express, React, Node",
          "MongoDB, Express, React, Node",
          "MongoDB, Ember, Redux, Node",
          "MariaDB, Express, React, Nest",
        ],
        correctIndex: 1,
      },
      {
        id: "q-mern-2",
        question: "Which React hook is used for side effects?",
        options: ["useState", "useMemo", "useEffect", "useRef"],
        correctIndex: 2,
      },
      {
        id: "q-mern-3",
        question: "In Express, what does app.use() do?",
        options: [
          "Registers middleware",
          "Starts the server",
          "Defines a route",
          "Imports a module",
        ],
        correctIndex: 0,
      },
      {
        id: "q-mern-4",
        question: "Which Mongoose concept represents a collection's shape?",
        options: ["Model", "Schema", "Document", "Router"],
        correctIndex: 1,
      },
      {
        id: "q-mern-5",
        question: "JWT tokens are typically signed using which algorithm family?",
        options: ["RSA / HMAC", "AES", "bcrypt", "MD5"],
        correctIndex: 0,
      },
    ],
  },
  {
    id: "quiz-python-1",
    courseId: "avm-python-fullstack",
    courseTitle: "Python Full Stack",
    title: "Python & Django Basics",
    totalQuestions: 4,
    duration: "8 min",
    status: "available",
    questions: [
      {
        id: "q-py-1",
        question: "How do you define a function in Python?",
        options: ["function foo():", "def foo():", "func foo():", "fn foo():"],
        correctIndex: 1,
      },
      {
        id: "q-py-2",
        question: "Which data structure does NOT allow duplicate elements?",
        options: ["list", "tuple", "set", "dict (keys are unique but values can repeat)"],
        correctIndex: 2,
      },
      {
        id: "q-py-3",
        question: "In Django, which file maps URLs to views?",
        options: ["models.py", "views.py", "urls.py", "settings.py"],
        correctIndex: 2,
      },
      {
        id: "q-py-4",
        question: "Which library is most commonly used for data manipulation in Python?",
        options: ["NumPy", "Pandas", "Matplotlib", "Requests"],
        correctIndex: 1,
      },
    ],
  },
];

export interface LMSGrade {
  courseId: string;
  courseTitle: string;
  assignmentsGrade: number;
  quizGrade: number;
  projectGrade: number;
  overallGrade: number;
  letterGrade: string;
}

// SAMPLE — computed grades per course
export const lmsGrades: LMSGrade[] = [
  {
    courseId: "avm-java-fullstack",
    courseTitle: "Java Full Stack Development",
    assignmentsGrade: 82,
    quizGrade: 75,
    projectGrade: 80,
    overallGrade: 79,
    letterGrade: "B+",
  },
  {
    courseId: "avm-python-fullstack",
    courseTitle: "Python Full Stack",
    assignmentsGrade: 70,
    quizGrade: 68,
    projectGrade: 72,
    overallGrade: 70,
    letterGrade: "B",
  },
  {
    courseId: "avm-mern-stack",
    courseTitle: "MERN Stack Web Development",
    assignmentsGrade: 92,
    quizGrade: 88,
    projectGrade: 95,
    overallGrade: 92,
    letterGrade: "A+",
  },
  {
    courseId: "avm-ai-ml",
    courseTitle: "AI / Machine Learning",
    assignmentsGrade: 60,
    quizGrade: 55,
    projectGrade: 58,
    overallGrade: 58,
    letterGrade: "C+",
  },
];

export interface LMSCertificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  certificateId: string;
  studentName: string;
}

// SAMPLE — earned certificates (only for high-progress / completed courses)
export const lmsCertificates: LMSCertificate[] = [
  {
    id: "cert-react-basics",
    courseId: "avm-react-basics-past",
    courseTitle: "React Frontend Fundamentals",
    issueDate: "2024-10-22",
    certificateId: "AVM-CERT-2024-0089",
    studentName: "Aarav Sharma",
  },
  {
    id: "cert-mern",
    courseId: "avm-mern-stack",
    courseTitle: "MERN Stack Web Development",
    issueDate: "2025-01-15",
    certificateId: "AVM-CERT-2025-0142",
    studentName: "Aarav Sharma",
  },
];

export type LMSActivityType =
  | "lesson"
  | "assignment"
  | "quiz"
  | "certificate"
  | "enrollment";

export interface LMSActivity {
  id: string;
  type: LMSActivityType;
  text: string;
  timestamp: string;
}

// SAMPLE — recent activity feed
export const lmsActivity: LMSActivity[] = [
  {
    id: "act-1",
    type: "lesson",
    text: "Completed lesson 'Inheritance & Polymorphism' in Java Full Stack",
    timestamp: "2 hours ago",
  },
  {
    id: "act-2",
    type: "quiz",
    text: "Scored 80% on 'Full-Stack JavaScript Concepts' quiz",
    timestamp: "1 day ago",
  },
  {
    id: "act-3",
    type: "assignment",
    text: "Submitted assignment 'Predict House Prices with Linear Regression'",
    timestamp: "2 days ago",
  },
  {
    id: "act-4",
    type: "certificate",
    text: "Earned certificate for 'MERN Stack Web Development'",
    timestamp: "4 days ago",
  },
  {
    id: "act-5",
    type: "lesson",
    text: "Started 'Client Routing & Data Fetching' in MERN Stack",
    timestamp: "6 days ago",
  },
  {
    id: "act-6",
    type: "enrollment",
    text: "Enrolled in 'AI / Machine Learning' course",
    timestamp: "1 week ago",
  },
];

export interface LMSDashboardStats {
  enrolledCourses: number;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  certificatesEarned: number;
  hoursLearned: number;
}

// SAMPLE — dashboard summary stats
export const lmsDashboardStats: LMSDashboardStats = {
  enrolledCourses: 4,
  completedLessons: 38,
  totalLessons: 72,
  averageScore: 78,
  certificatesEarned: 2,
  hoursLearned: 124,
};

// Helper lookups used across LMS pages
export function getLMSCourse(id: string): LMSCourse | undefined {
  return lmsCourses.find((c) => c.id === id);
}

export function getLMSLesson(
  courseId: string,
  lessonId: string
): { course: LMSCourse; module: LMSModule; lesson: LMSLesson; lessonIndex: number; moduleIndex: number } | undefined {
  const course = getLMSCourse(courseId);
  if (!course) return undefined;
  for (let mi = 0; mi < course.modules.length; mi++) {
    const mod = course.modules[mi];
    const li = mod.lessons.findIndex((l) => l.id === lessonId);
    if (li !== -1) {
      return { course, module: mod, lesson: mod.lessons[li], lessonIndex: li, moduleIndex: mi };
    }
  }
  return undefined;
}

/**
 * Returns a flat ordered list of all lessons across a course's modules,
 * useful for prev/next navigation in the lesson player.
 */
export function flattenLessons(course: LMSCourse): { lesson: LMSLesson; module: LMSModule; moduleIndex: number; lessonIndex: number }[] {
  const out: { lesson: LMSLesson; module: LMSModule; moduleIndex: number; lessonIndex: number }[] = [];
  course.modules.forEach((mod, mi) => {
    mod.lessons.forEach((lesson, li) => {
      out.push({ lesson, module: mod, moduleIndex: mi, lessonIndex: li });
    });
  });
  return out;
}

/**
 * Returns the first incomplete lesson of a course (or null if all complete),
 * used for the "Continue" CTA on the course view page.
 */
export function firstIncompleteLesson(course: LMSCourse): { lesson: LMSLesson; module: LMSModule; moduleIndex: number; lessonIndex: number } | null {
  const flat = flattenLessons(course);
  return flat.find((x) => !x.lesson.completed) ?? null;
}

/**
 * Maps any domain title, slug, or ID to a matching LMSCourse.
 */
export function findCourseByDomain(domainQuery?: string): LMSCourse {
  if (!domainQuery) return lmsCourses[0];
  const q = domainQuery.trim().toLowerCase();

  if (q.includes("python")) {
    return lmsCourses.find((c) => c.id === "avm-python-fullstack") || lmsCourses[1];
  }
  if (q.includes("java") || q.includes("spring")) {
    return lmsCourses.find((c) => c.id === "avm-java-fullstack") || lmsCourses[0];
  }
  if (q.includes("mern") || q.includes("react") || q.includes("web dev") || q.includes("node")) {
    return lmsCourses.find((c) => c.id === "avm-mern-fullstack") || lmsCourses[2];
  }
  if (q.includes("ai") || q.includes("machine") || q.includes("ml")) {
    return lmsCourses.find((c) => c.id === "avm-ai-ml") || lmsCourses[3];
  }
  if (q.includes("cloud") || q.includes("devops") || q.includes("aws") || q.includes("docker")) {
    return lmsCourses.find((c) => c.id === "avm-cloud-devops") || lmsCourses[4];
  }
  if (q.includes("ui") || q.includes("ux") || q.includes("design") || q.includes("figma")) {
    return lmsCourses.find((c) => c.id === "avm-ui-ux") || lmsCourses[5];
  }
  if (q.includes("flutter") || q.includes("mobile") || q.includes("dart")) {
    return lmsCourses.find((c) => c.id === "avm-mobile-flutter") || lmsCourses[6];
  }
  if (q.includes("data") || q.includes("analytics") || q.includes("power bi") || q.includes("sql")) {
    return lmsCourses.find((c) => c.id === "avm-data-analytics") || lmsCourses[7];
  }

  const matched = lmsCourses.find(
    (c) =>
      c.id.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q)
  );
  return matched || lmsCourses[0];
}

