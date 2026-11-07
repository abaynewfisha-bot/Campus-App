import fs from "fs";
import path from "path";
import { pool } from "../config/db";
import { hashPassword } from "../utils/hashPassword";

function daysFromNow(days: number, hour = 9): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

async function seedData(): Promise<void> {
  const existing = await pool.query<{ count: number }>(
    "SELECT COUNT(*)::int AS count FROM users",
  );

  if (existing.rows[0].count > 0) {
    console.log("Database already contains data. Skipping seed.");
    return;
  }

  const password = await hashPassword("Password123");

  const users: Array<[string, string, string]> = [
    ["Campus Administrator", "admin@campus.edu", "admin"],
    ["Service Desk Staff", "staff@campus.edu", "staff"],
    ["Demo Student", "student@campus.edu", "student"],
  ];

  const userIds: Record<string, string> = {};

  for (const [fullName, email, role] of users) {
    const result = await pool.query<{ id: string }>(
      `INSERT INTO users (full_name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [fullName, email, password, role],
    );
    userIds[role] = result.rows[0].id;
  }

  const announcements: Array<[string, string, string]> = [
    [
      "Welcome to the New Semester",
      "All students are welcome back to campus. Please check the academic calendar and complete your course registration before the deadline.",
      "academics",
    ],
    [
      "Library Extended Hours",
      "The main library will remain open until 10:00 PM throughout the examination period.",
      "library",
    ],
    [
      "Campus Wi-Fi Maintenance",
      "Wi-Fi will be unavailable in Block A on Saturday from 8:00 AM to 12:00 PM due to scheduled maintenance.",
      "services",
    ],
    [
      "Scholarship Applications Open",
      "Applications for the merit scholarship are now open. Submit your documents to the student affairs office by the end of the month.",
      "scholarship",
    ],
  ];

  for (const [title, description, category] of announcements) {
    await pool.query(
      `INSERT INTO announcements (title, description, category, author_id)
       VALUES ($1, $2, $3, $4)`,
      [title, description, category, userIds.admin],
    );
  }

  const events: Array<[string, string, string, string, string, string]> = [
    [
      "Freshers Orientation",
      "Meet your faculty, learn about campus services, and take a guided campus tour.",
      "Main Auditorium",
      "orientation",
      daysFromNow(3),
      daysFromNow(3, 15),
    ],
    [
      "Tech Innovation Expo",
      "Student projects, startup showcases, and guest talks from the tech industry.",
      "Engineering Hall",
      "technology",
      daysFromNow(10),
      daysFromNow(10, 17),
    ],
    [
      "Cultural Night",
      "An evening of music, dance, and food from across the country.",
      "Campus Green",
      "culture",
      daysFromNow(17),
      daysFromNow(17, 21),
    ],
    [
      "Career Fair",
      "Meet recruiters from leading companies and explore internship opportunities.",
      "Student Center",
      "career",
      daysFromNow(24),
      daysFromNow(24, 16),
    ],
  ];

  for (const [
    title,
    description,
    location,
    category,
    startDate,
    endDate,
  ] of events) {
    await pool.query(
      `INSERT INTO events (title, description, location, category, start_date, end_date, organizer_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        title,
        description,
        location,
        category,
        startDate,
        endDate,
        userIds.admin,
      ],
    );
  }

  const clubs: Array<[string, string, string, string]> = [
    [
      "Computer Science Club",
      "A community of students who build projects, attend hackathons, and share programming knowledge.",
      "cs.club@campus.edu",
      "Weekly coding sessions, hackathons, and tech talks.",
    ],
    [
      "Debate Society",
      "Develop public speaking and critical thinking skills through weekly debates and tournaments.",
      "debate@campus.edu",
      "Weekly debates, inter-university tournaments, and workshops.",
    ],
    [
      "Red Cross Club",
      "Volunteer for community health initiatives, first aid training, and blood donation drives.",
      "redcross@campus.edu",
      "First aid training, blood drives, and community outreach.",
    ],
    [
      "Entrepreneurship Club",
      "Connect with aspiring founders, mentors, and startup resources on campus.",
      "startup@campus.edu",
      "Pitch nights, mentorship sessions, and startup visits.",
    ],
  ];

  for (const [name, description, contactEmail, activities] of clubs) {
    await pool.query(
      `INSERT INTO clubs (name, description, contact_email, activities)
       VALUES ($1, $2, $3, $4)`,
      [name, description, contactEmail, activities],
    );
  }

  const facilities: Array<[string, string, string, number, number, string]> = [
    [
      "Main Library",
      "library",
      "A quiet study space with books, journals, and digital resources.",
      9.0305,
      38.742,
      "+251 911 000 101",
    ],
    [
      "Student Cafeteria",
      "dining",
      "Affordable meals and refreshments served throughout the day.",
      9.0312,
      38.7405,
      "+251 911 000 102",
    ],
    [
      "Campus Health Center",
      "health",
      "Primary healthcare, first aid, and counseling services for students and staff.",
      9.0295,
      38.7395,
      "+251 911 000 103",
    ],
    [
      "Computer Laboratory",
      "laboratory",
      "Computer workstations, printing, and internet access for coursework.",
      9.032,
      38.7415,
      "+251 911 000 104",
    ],
    [
      "Administration Office",
      "administration",
      "Registration, student records, and general administrative services.",
      9.0308,
      38.743,
      "+251 911 000 105",
    ],
    [
      "Sports Complex",
      "sports",
      "Gym, courts, and fields for football, basketball, and athletics.",
      9.0288,
      38.7425,
      "+251 911 000 106",
    ],
  ];

  for (const [
    name,
    category,
    description,
    latitude,
    longitude,
    contact,
  ] of facilities) {
    await pool.query(
      `INSERT INTO facilities (name, category, description, latitude, longitude, contact)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, category, description, latitude, longitude, contact],
    );
  }

  const contacts: Array<[string, string, string]> = [
    ["Campus Security", "+251 911 000 111", "24/7 campus security and emergency response."],
    ["Campus Health Center", "+251 911 000 222", "Medical emergencies and first aid."],
    ["Fire Service", "911", "Fire and rescue emergencies."],
    ["Student Affairs", "+251 911 000 333", "Student welfare and support services."],
  ];

  for (const [department, phone, description] of contacts) {
    await pool.query(
      `INSERT INTO emergency_contacts (department, phone, description)
       VALUES ($1, $2, $3)`,
      [department, phone, description],
    );
  }

  const requests: Array<[string, string, string, string, string]> = [
    [
      "Broken chair in Room 204",
      "One of the chairs in Room 204 is broken and unsafe to use.",
      "maintenance",
      "Block B, Room 204",
      "pending",
    ],
    [
      "Wi-Fi not working in dormitory",
      "The Wi-Fi connection has been down in Dormitory 3 since yesterday.",
      "it",
      "Dormitory 3",
      "in_progress",
    ],
  ];

  for (const [title, description, category, location, status] of requests) {
    await pool.query(
      `INSERT INTO service_requests (user_id, title, description, category, location, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userIds.student, title, description, category, location, status],
    );
  }

  const feedbackEntries: Array<[string, string, string, string]> = [
    [
      "Cafeteria food quality",
      "The quality of food in the cafeteria has declined recently. Please review the menu.",
      "dining",
      "pending",
    ],
    [
      "More study spaces needed",
      "The library is often full during exam periods. Additional study spaces would help.",
      "facilities",
      "reviewed",
    ],
  ];

  for (const [subject, description, category, status] of feedbackEntries) {
    await pool.query(
      `INSERT INTO feedback (user_id, subject, description, category, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [userIds.student, subject, description, category, status],
    );
  }

  const notifications: Array<[string, string, boolean]> = [
    ["Welcome to the Campus App", "Explore announcements, events, and campus services.", false],
    ["Event reminder", "Tech Innovation Expo is coming up next week.", false],
    ["Service request updated", "Your Wi-Fi request is now in progress.", true],
  ];

  for (const [title, message, isRead] of notifications) {
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, is_read)
       VALUES ($1, $2, $3, $4)`,
      [userIds.student, title, message, isRead],
    );
  }

  console.log("Database schema created and demo data seeded.");
  console.log("Demo accounts (password: Password123):");
  console.log("  admin@campus.edu   (admin)");
  console.log("  staff@campus.edu   (staff)");
  console.log("  student@campus.edu (student)");
}

async function main(): Promise<void> {
  const schemaPath = path.resolve(process.cwd(), "database", "schema.sql");
  const indexesPath = path.resolve(process.cwd(), "database", "indexes.sql");

  const schema = fs.readFileSync(schemaPath, "utf8");
  const indexes = fs.readFileSync(indexesPath, "utf8");

  await pool.query(schema);
  await pool.query(indexes);
  console.log("Schema and indexes applied.");

  await seedData();
}

main()
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exitCode = 1;
  })
  .finally(() => {
    void pool.end();
  });
