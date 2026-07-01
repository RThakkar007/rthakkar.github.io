import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// ─── Services ────────────────────────────────────────────────────────────────
const servicesData = [
  {
    slug: "foam-jet-1ac",
    name: "Foam-jet cleaning (1 AC)",
    category: "cleaning",
    description: "Deep indoor unit cleaning with foam & jet spray. Removes dust, bacteria, and improves cooling efficiency.",
    basePrice: "599.00",
    originalPrice: "799.00",
    durationMinutes: 60,
    unit: "per AC",
    acCount: 1,
    rating: "4.76",
    reviewCount: 2800000,
    isPopular: true,
    highlights: JSON.stringify(["Indoor unit deep cleaning", "Foam & jet spray technology", "Applicable for split & window ACs", "Improves cooling by up to 20%"]),
  },
  {
    slug: "foam-jet-2ac",
    name: "Foam-jet cleaning (2 ACs)",
    category: "cleaning",
    description: "Deep cleaning for 2 ACs with foam & jet spray. Best value for homes with multiple units.",
    basePrice: "1098.00",
    originalPrice: "1398.00",
    durationMinutes: 120,
    unit: "₹549 per AC",
    acCount: 2,
    rating: "4.76",
    reviewCount: 2800000,
    isPopular: false,
    highlights: JSON.stringify(["2 AC units covered", "₹549 per AC", "Foam & jet spray technology", "2 hour service"]),
  },
  {
    slug: "foam-jet-3ac",
    name: "Foam-jet cleaning (3 ACs)",
    category: "cleaning",
    description: "Deep cleaning for 3 ACs. Ideal for larger homes or offices.",
    basePrice: "1497.00",
    originalPrice: "1797.00",
    durationMinutes: 180,
    unit: "₹499 per AC",
    acCount: 3,
    rating: "4.76",
    reviewCount: 2800000,
    isPopular: false,
    highlights: JSON.stringify(["3 AC units covered", "₹499 per AC", "3 hour service", "Best for offices"]),
  },
  {
    slug: "foam-jet-4ac",
    name: "Foam-jet cleaning (4 ACs)",
    category: "cleaning",
    description: "Deep cleaning for 4 ACs at the best per-unit rate.",
    basePrice: "1796.00",
    originalPrice: "2396.00",
    durationMinutes: 240,
    unit: "₹449 per AC",
    acCount: 4,
    rating: "4.76",
    reviewCount: 2800000,
    isPopular: false,
    highlights: JSON.stringify(["4 AC units covered", "₹449 per AC", "4 hour service", "Maximum savings"]),
  },
  {
    slug: "foam-jet-5ac",
    name: "Foam-jet cleaning (5 ACs)",
    category: "cleaning",
    description: "Deep cleaning for 5 ACs. Best per-unit savings for large properties.",
    basePrice: "2245.00",
    originalPrice: "2995.00",
    durationMinutes: 300,
    unit: "₹449 per AC",
    acCount: 5,
    rating: "4.76",
    reviewCount: 2800000,
    isPopular: false,
    highlights: JSON.stringify(["5 AC units covered", "₹449 per AC", "5 hour service", "Best value bundle"]),
  },
  {
    slug: "ac-repair",
    name: "AC Repair",
    category: "repair",
    description: "Complete diagnostic check-up to identify and fix all AC issues. Covers cooling problems, noise, leaks, and more.",
    basePrice: "299.00",
    originalPrice: null,
    durationMinutes: 90,
    unit: "starts at",
    acCount: 1,
    rating: "4.73",
    reviewCount: 833000,
    isPopular: true,
    highlights: JSON.stringify(["Complete diagnostic check-up", "Identifies root cause before repair", "Covers all AC brands", "90-day service warranty"]),
  },
  {
    slug: "gas-refill",
    name: "Gas Refill & Check-up",
    category: "gas",
    description: "Full gas refill with pressure check and system diagnostics. Restores optimal cooling performance.",
    basePrice: "2800.00",
    originalPrice: null,
    durationMinutes: 150,
    unit: "per service",
    acCount: 1,
    rating: "4.78",
    reviewCount: 112000,
    isPopular: false,
    highlights: JSON.stringify(["Gas refill included", "Pressure check & diagnostics", "Leak detection", "2.5 hour service"]),
  },
  {
    slug: "ac-installation",
    name: "AC Installation",
    category: "installation",
    description: "Professional installation of indoor & outdoor units with free gas check. Covers split and window ACs.",
    basePrice: "1099.00",
    originalPrice: null,
    durationMinutes: 120,
    unit: "starts at",
    acCount: 1,
    rating: "4.69",
    reviewCount: 146000,
    isPopular: true,
    highlights: JSON.stringify(["Indoor & outdoor unit installation", "Free gas check included", "Covers split & window ACs", "Professional mounting & wiring"]),
  },
  {
    slug: "ac-uninstallation",
    name: "AC Uninstallation",
    category: "installation",
    description: "Safe uninstallation of both indoor and outdoor units. Includes gas recovery and safe dismounting.",
    basePrice: "699.00",
    originalPrice: null,
    durationMinutes: 90,
    unit: "starts at",
    acCount: 1,
    rating: "4.80",
    reviewCount: 137000,
    isPopular: false,
    highlights: JSON.stringify(["Indoor & outdoor unit removal", "Gas recovery included", "Safe dismounting", "No damage guarantee"]),
  },
];

// ─── Technicians ─────────────────────────────────────────────────────────────
const techniciansData = [
  {
    name: "Rajesh Kumar",
    phone: "+91-98765-43210",
    email: "rajesh.kumar@cooltech.in",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh&backgroundColor=b6e3f4",
    rating: "4.92",
    reviewCount: 1247,
    yearsExperience: 8,
    isVerified: true,
    isAvailable: true,
    specializations: JSON.stringify(["AC Repair", "Gas Refill & Check-up", "Foam-jet cleaning"]),
    latitude: 28.6139,
    longitude: 77.2090,
    bio: "Certified AC technician with 8 years of experience. Specialized in split AC systems and inverter technology.",
    completedJobs: 3420,
  },
  {
    name: "Suresh Patel",
    phone: "+91-98765-43211",
    email: "suresh.patel@cooltech.in",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh&backgroundColor=c0aede",
    rating: "4.85",
    reviewCount: 892,
    yearsExperience: 6,
    isVerified: true,
    isAvailable: true,
    specializations: JSON.stringify(["AC Installation", "AC Uninstallation", "AC Repair"]),
    latitude: 28.6200,
    longitude: 77.2150,
    bio: "Expert in AC installation and uninstallation. Handled 2000+ installations across Delhi NCR.",
    completedJobs: 2180,
  },
  {
    name: "Amit Singh",
    phone: "+91-98765-43212",
    email: "amit.singh@cooltech.in",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit&backgroundColor=ffdfbf",
    rating: "4.88",
    reviewCount: 1056,
    yearsExperience: 7,
    isVerified: true,
    isAvailable: false,
    specializations: JSON.stringify(["Foam-jet cleaning", "AC Repair", "Gas Refill & Check-up"]),
    latitude: 28.6080,
    longitude: 77.2200,
    bio: "Foam-jet cleaning specialist. Known for thorough cleaning and attention to detail.",
    completedJobs: 2890,
  },
  {
    name: "Vikram Sharma",
    phone: "+91-98765-43213",
    email: "vikram.sharma@cooltech.in",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram&backgroundColor=d1d4f9",
    rating: "4.79",
    reviewCount: 634,
    yearsExperience: 5,
    isVerified: true,
    isAvailable: true,
    specializations: JSON.stringify(["Gas Refill & Check-up", "AC Repair"]),
    latitude: 28.6250,
    longitude: 77.2050,
    bio: "Gas refill and diagnostics expert. Certified in refrigerant handling and leak detection.",
    completedJobs: 1560,
  },
  {
    name: "Pradeep Yadav",
    phone: "+91-98765-43214",
    email: "pradeep.yadav@cooltech.in",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pradeep&backgroundColor=ffd5dc",
    rating: "4.95",
    reviewCount: 2103,
    yearsExperience: 10,
    isVerified: true,
    isAvailable: true,
    specializations: JSON.stringify(["AC Repair", "AC Installation", "Gas Refill & Check-up", "Foam-jet cleaning"]),
    latitude: 28.6100,
    longitude: 77.2300,
    bio: "Senior technician with 10 years of experience. Expert in all AC brands including Daikin, Voltas, LG, and Samsung.",
    completedJobs: 4750,
  },
];

// ─── Reviews ──────────────────────────────────────────────────────────────────
const reviewsData = [
  { userId: 1, serviceId: 1, technicianId: 1, rating: 5, authorName: "Priya Mehta", comment: "Excellent service! The technician was punctual and very professional. My AC is cooling much better now." },
  { userId: 1, serviceId: 1, technicianId: 2, rating: 5, authorName: "Rohit Gupta", comment: "Great foam-jet cleaning service. The technician explained everything clearly and the AC is working perfectly." },
  { userId: 1, serviceId: 6, technicianId: 1, rating: 4, authorName: "Anita Sharma", comment: "Quick diagnosis and repair. Fixed the issue in under an hour. Very satisfied." },
  { userId: 1, serviceId: 6, technicianId: 5, rating: 5, authorName: "Deepak Verma", comment: "Pradeep is amazing! He identified the problem immediately and fixed it efficiently. Highly recommend." },
  { userId: 1, serviceId: 7, technicianId: 4, rating: 5, authorName: "Sunita Rao", comment: "Gas refill done perfectly. AC is cooling like new. Very professional service." },
  { userId: 1, serviceId: 8, technicianId: 2, rating: 4, authorName: "Manoj Kumar", comment: "Installation was clean and professional. No mess left behind. Good work." },
  { userId: 1, serviceId: 9, technicianId: 2, rating: 5, authorName: "Kavita Singh", comment: "Uninstallation done carefully without any damage. Very happy with the service." },
  { userId: 1, serviceId: 1, technicianId: 3, rating: 5, authorName: "Ravi Patel", comment: "Amit is very thorough with his cleaning. The AC is much quieter and cooler now." },
  { userId: 1, serviceId: 6, technicianId: 5, rating: 5, authorName: "Neha Joshi", comment: "Best AC repair service I've ever used. Pradeep fixed what two other technicians couldn't." },
  { userId: 1, serviceId: 8, technicianId: 1, rating: 4, authorName: "Arun Mishra", comment: "Good installation service. Took a bit longer than expected but quality was excellent." },
];

try {
  // Insert services
  for (const svc of servicesData) {
    await connection.execute(
      `INSERT IGNORE INTO services (slug, name, category, description, basePrice, originalPrice, durationMinutes, unit, acCount, rating, reviewCount, isPopular, highlights) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [svc.slug, svc.name, svc.category, svc.description, svc.basePrice, svc.originalPrice, svc.durationMinutes, svc.unit, svc.acCount, svc.rating, svc.reviewCount, svc.isPopular, svc.highlights]
    );
  }
  console.log("✅ Services seeded");

  // Insert technicians
  for (const tech of techniciansData) {
    await connection.execute(
      `INSERT IGNORE INTO technicians (name, phone, email, photoUrl, rating, reviewCount, yearsExperience, isVerified, isAvailable, specializations, latitude, longitude, bio, completedJobs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tech.name, tech.phone, tech.email, tech.photoUrl, tech.rating, tech.reviewCount, tech.yearsExperience, tech.isVerified, tech.isAvailable, tech.specializations, tech.latitude, tech.longitude, tech.bio, tech.completedJobs]
    );
  }
  console.log("✅ Technicians seeded");

  // Insert technician locations
  const [techRows] = await connection.execute("SELECT id, latitude, longitude FROM technicians");
  for (const tech of techRows) {
    await connection.execute(
      `INSERT INTO technician_locations (technicianId, latitude, longitude) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE latitude=VALUES(latitude), longitude=VALUES(longitude)`,
      [tech.id, tech.latitude, tech.longitude]
    );
  }
  console.log("✅ Technician locations seeded");

  // Insert a dummy user for reviews
  await connection.execute(
    `INSERT IGNORE INTO users (openId, name, email, role) VALUES ('seed-user-001', 'Demo User', 'demo@cooltech.in', 'user')`
  );
  const [[demoUser]] = await connection.execute(`SELECT id FROM users WHERE openId = 'seed-user-001'`);

  // Insert reviews
  const [serviceRows] = await connection.execute("SELECT id FROM services ORDER BY id");
  const [technicianRows] = await connection.execute("SELECT id FROM technicians ORDER BY id");

  for (let i = 0; i < reviewsData.length; i++) {
    const r = reviewsData[i];
    const svcId = serviceRows[r.serviceId - 1]?.id || serviceRows[0].id;
    const techId = technicianRows[(r.technicianId || 1) - 1]?.id || technicianRows[0].id;
    await connection.execute(
      `INSERT INTO reviews (userId, serviceId, technicianId, rating, authorName, comment) VALUES (?, ?, ?, ?, ?, ?)`,
      [demoUser.id, svcId, techId, r.rating, r.authorName, r.comment]
    );
  }
  console.log("✅ Reviews seeded");

  console.log("🎉 All seed data inserted successfully!");
} catch (err) {
  console.error("Seed error:", err.message);
} finally {
  await connection.end();
}
