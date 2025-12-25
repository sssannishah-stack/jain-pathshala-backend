const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Initialize Express
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// ==================== CONSTANTS ====================
const APPROVAL_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const TRANSLATIONS = {
  en: {
    greeting: "Jai Jinendra",
    attendance: "Attendance",
    gatha: "Gatha",
    // ... add more
  },
  hi: {
    greeting: "जय जिनेन्द्र",
    attendance: "उपस्थिति",
    gatha: "गाथा",
  },
  gu: {
    greeting: "જય જિનેન્દ્ર",
    attendance: "હાજરી",
    gatha: "ગાથા",
  },
};

// ==================== MIDDLEWARE ====================
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...userDoc.data(),
    };
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

// ==================== ROUTES ====================

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🙏 Jai Jinendra! Jain Pathshala API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Get translations
app.get("/languages", (req, res) => {
  res.json({
    success: true,
    languages: [
      { code: "en", name: "English" },
      { code: "hi", name: "हिंदी" },
      { code: "gu", name: "ગુજરાતી" },
    ],
  });
});

app.get("/translations/:lang", (req, res) => {
  const { lang } = req.params;
  const translations = TRANSLATIONS[lang] || TRANSLATIONS.en;
  res.json({ success: true, translations });
});

// ==================== AUTH ROUTES ====================
app.get("/auth/me", authenticate, (req, res) => {
  res.json({
    success: true,
    user: {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      members: req.user.members || [],
      groupName: req.user.groupName,
    },
  });
});

// ==================== ATTENDANCE ROUTES ====================

// Mark attendance
app.post("/attendance/mark", authenticate, async (req, res) => {
  try {
    const { memberId, memberName } = req.body;
    const today = new Date().toISOString().split("T")[0];

    // Check if already marked
    const existing = await db.collection("attendance")
      .where("memberId", "==", memberId)
      .where("date", "==", today)
      .get();

    if (!existing.empty) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for today",
      });
    }

    // Create attendance record
    const docRef = await db.collection("attendance").add({
      userId: req.user.uid,
      memberId,
      memberName,
      groupName: req.user.groupName || req.user.name,
      date: today,
      status: APPROVAL_STATUS.PENDING,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      message: "Attendance marked successfully",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Attendance error:", error);
    res.status(500).json({ success: false, message: "Failed to mark attendance" });
  }
});

// Get attendance history
app.get("/attendance/history/:memberId", authenticate, async (req, res) => {
  try {
    const { memberId } = req.params;
    const { status, startDate, endDate, limit = 50 } = req.query;

    let query = db.collection("attendance").where("memberId", "==", memberId);

    if (status) {
      query = query.where("status", "==", status);
    }

    if (startDate && endDate) {
      query = query.where("date", ">=", startDate).where("date", "<=", endDate);
    }

    query = query.orderBy("date", "desc").limit(parseInt(limit));

    const snapshot = await query.get();
    const records = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.json({ success: true, records });
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch history" });
  }
});

// Check today's attendance
app.get("/attendance/today/:memberId", authenticate, async (req, res) => {
  try {
    const { memberId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    const snapshot = await db.collection("attendance")
      .where("memberId", "==", memberId)
      .where("date", "==", today)
      .get();

    if (snapshot.empty) {
      return res.json({ success: true, marked: false });
    }

    const record = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    res.json({ success: true, marked: true, record });
  } catch (error) {
    console.error("Today check error:", error);
    res.status(500).json({ success: false, message: "Failed to check attendance" });
  }
});

// ==================== GATHA ROUTES ====================

// Add gatha
app.post("/gatha/add", authenticate, async (req, res) => {
  try {
    const { memberId, memberName, type, sutraName, gathaNo, totalGatha } = req.body;

    // Validation
    if (!memberId || !memberName || !type || !sutraName || !gathaNo || !totalGatha) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const today = new Date().toISOString().split("T")[0];

    const docRef = await db.collection("gatha").add({
      userId: req.user.uid,
      memberId,
      memberName,
      groupName: req.user.groupName || req.user.name,
      type,
      sutraName,
      gathaNo: parseInt(gathaNo),
      totalGatha: parseInt(totalGatha),
      date: today,
      status: APPROVAL_STATUS.PENDING,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      message: "Gatha added successfully",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Gatha error:", error);
    res.status(500).json({ success: false, message: "Failed to add gatha" });
  }
});

// Get gatha history
app.get("/gatha/history/:memberId", authenticate, async (req, res) => {
  try {
    const { memberId } = req.params;
    const { status, type, limit = 50 } = req.query;

    let query = db.collection("gatha").where("memberId", "==", memberId);

    if (status) {
      query = query.where("status", "==", status);
    }

    if (type) {
      query = query.where("type", "==", type);
    }

    query = query.orderBy("date", "desc").limit(parseInt(limit));

    const snapshot = await query.get();
    const records = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.json({ success: true, records });
  } catch (error) {
    console.error("Gatha history error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch gatha history" });
  }
});

// Get gatha stats
app.get("/gatha/stats/:memberId", authenticate, async (req, res) => {
  try {
    const { memberId } = req.params;

    const snapshot = await db.collection("gatha")
      .where("memberId", "==", memberId)
      .where("status", "==", APPROVAL_STATUS.APPROVED)
      .get();

    const records = snapshot.docs.map((doc) => doc.data());

    const newGatha = records.filter((r) => r.type === "new");
    const revisionGatha = records.filter((r) => r.type === "revision");

    const stats = {
      totalEntries: records.length,
      newGatha: {
        count: newGatha.length,
        totalGatha: newGatha.reduce((sum, r) => sum + (r.totalGatha || 0), 0),
      },
      revision: {
        count: revisionGatha.length,
        totalGatha: revisionGatha.reduce((sum, r) => sum + (r.totalGatha || 0), 0),
      },
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all pending records
app.get("/admin/pending", authenticate, isAdmin, async (req, res) => {
  try {
    // Get pending attendance
    const attendanceSnap = await db.collection("attendance")
      .where("status", "==", APPROVAL_STATUS.PENDING)
      .orderBy("createdAt", "desc")
      .get();

    const attendance = attendanceSnap.docs.map((doc) => ({
      id: doc.id,
      type: "attendance",
      ...doc.data(),
    }));

    // Get pending gatha
    const gathaSnap = await db.collection("gatha")
      .where("status", "==", APPROVAL_STATUS.PENDING)
      .orderBy("createdAt", "desc")
      .get();

    const gatha = gathaSnap.docs.map((doc) => ({
      id: doc.id,
      type: "gatha",
      ...doc.data(),
    }));

    res.json({
      success: true,
      attendance,
      gatha,
      counts: {
        attendance: attendance.length,
        gatha: gatha.length,
        total: attendance.length + gatha.length,
      },
    });
  } catch (error) {
    console.error("Pending error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch pending records" });
  }
});

// Approve record
app.post("/admin/approve/:type/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { type, id } = req.params;
    const collection = type === "attendance" ? "attendance" : "gatha";

    await db.collection(collection).doc(id).update({
      status: APPROVAL_STATUS.APPROVED,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      approvedBy: req.user.uid,
    });

    res.json({ success: true, message: "Approved successfully" });
  } catch (error) {
    console.error("Approve error:", error);
    res.status(500).json({ success: false, message: "Failed to approve" });
  }
});

// Reject record
app.post("/admin/reject/:type/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { type, id } = req.params;
    const collection = type === "attendance" ? "attendance" : "gatha";

    await db.collection(collection).doc(id).update({
      status: APPROVAL_STATUS.REJECTED,
      rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
      rejectedBy: req.user.uid,
    });

    res.json({ success: true, message: "Rejected successfully" });
  } catch (error) {
    console.error("Reject error:", error);
    res.status(500).json({ success: false, message: "Failed to reject" });
  }
});

// Approve all pending
app.post("/admin/approve-all/:type", authenticate, isAdmin, async (req, res) => {
  try {
    const { type } = req.params;
    const collection = type === "attendance" ? "attendance" : "gatha";

    const snapshot = await db.collection(collection)
      .where("status", "==", APPROVAL_STATUS.PENDING)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: APPROVAL_STATUS.APPROVED,
        approvedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: req.user.uid,
      });
    });

    await batch.commit();

    res.json({
      success: true,
      message: `Approved ${snapshot.docs.length} records`,
      count: snapshot.docs.length,
    });
  } catch (error) {
    console.error("Approve all error:", error);
    res.status(500).json({ success: false, message: "Failed to approve all" });
  }
});

// Get all students
app.get("/admin/students", authenticate, isAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection("users")
      .where("role", "==", "user")
      .get();

    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, students });
  } catch (error) {
    console.error("Students error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch students" });
  }
});

// Add member to a user
app.post("/admin/students/:userId/members", authenticate, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Member name is required" });
    }

    const memberId = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newMember = { id: memberId, name };

    await db.collection("users").doc(userId).update({
      members: admin.firestore.FieldValue.arrayUnion(newMember),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      message: "Member added successfully",
      member: newMember,
    });
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({ success: false, message: "Failed to add member" });
  }
});

// Get student details with stats
app.get("/admin/students/:memberId/details", authenticate, isAdmin, async (req, res) => {
  try {
    const { memberId } = req.params;
    const { year, month } = req.query;

    const currentYear = year || new Date().getFullYear();
    const currentMonth = month || new Date().getMonth() + 1;

    const startDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;
    const endDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-31`;

    // Get attendance
    const attendanceSnap = await db.collection("attendance")
      .where("memberId", "==", memberId)
      .where("status", "==", APPROVAL_STATUS.APPROVED)
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .get();

    // Get gatha
    const gathaSnap = await db.collection("gatha")
      .where("memberId", "==", memberId)
      .where("status", "==", APPROVAL_STATUS.APPROVED)
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .get();

    const attendance = attendanceSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const gatha = gathaSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const newGatha = gatha.filter((g) => g.type === "new");
    const revisionGatha = gatha.filter((g) => g.type === "revision");

    res.json({
      success: true,
      period: { year: currentYear, month: currentMonth },
      stats: {
        daysPresent: attendance.length,
        newGatha: newGatha.reduce((sum, g) => sum + (g.totalGatha || 0), 0),
        revisionGatha: revisionGatha.reduce((sum, g) => sum + (g.totalGatha || 0), 0),
      },
      attendance,
      gatha,
    });
  } catch (error) {
    console.error("Student details error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student details" });
  }
});

// ==================== REPORT ROUTES ====================

// Get monthly report
app.get("/reports/monthly/:memberId", authenticate, async (req, res) => {
  try {
    const { memberId } = req.params;
    const { year, month } = req.query;

    const currentYear = parseInt(year) || new Date().getFullYear();
    const currentMonth = parseInt(month) || new Date().getMonth() + 1;

    const startDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;
    const endDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-31`;

    // Get attendance
    const attendanceSnap = await db.collection("attendance")
      .where("memberId", "==", memberId)
      .where("status", "==", APPROVAL_STATUS.APPROVED)
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .orderBy("date", "asc")
      .get();

    const attendance = attendanceSnap.docs.map((doc) => doc.data());

    // Get gatha
    const gathaSnap = await db.collection("gatha")
      .where("memberId", "==", memberId)
      .where("status", "==", APPROVAL_STATUS.APPROVED)
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .orderBy("date", "asc")
      .get();

    const gatha = gathaSnap.docs.map((doc) => doc.data());

    // Calculate daily breakdown
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const dailyBreakdown = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const present = attendance.some((a) => a.date === dateStr);
      const dayGatha = gatha.filter((g) => g.date === dateStr);

      dailyBreakdown.push({
        date: dateStr,
        day,
        present,
        gatha: dayGatha,
      });
    }

    // Group gatha by sutra
    const sutraProgress = {};
    gatha.forEach((g) => {
      if (!sutraProgress[g.sutraName]) {
        sutraProgress[g.sutraName] = { new: 0, revision: 0, entries: 0 };
      }
      sutraProgress[g.sutraName].entries++;
      if (g.type === "new") {
        sutraProgress[g.sutraName].new += g.totalGatha || 0;
      } else {
        sutraProgress[g.sutraName].revision += g.totalGatha || 0;
      }
    });

    const newGatha = gatha.filter((g) => g.type === "new");
    const revisionGatha = gatha.filter((g) => g.type === "revision");

    res.json({
      success: true,
      report: {
        period: {
          year: currentYear,
          month: currentMonth,
          daysInMonth,
        },
        summary: {
          daysPresent: attendance.length,
          attendancePercentage: Math.round((attendance.length / daysInMonth) * 100),
          totalNewGatha: newGatha.reduce((sum, g) => sum + (g.totalGatha || 0), 0),
          totalRevision: revisionGatha.reduce((sum, g) => sum + (g.totalGatha || 0), 0),
        },
        dailyBreakdown,
        sutraProgress: Object.entries(sutraProgress).map(([name, data]) => ({
          sutraName: name,
          ...data,
        })),
      },
    });
  } catch (error) {
    console.error("Monthly report error:", error);
    res.status(500).json({ success: false, message: "Failed to generate report" });
  }
});

// Get progress chart data
app.get("/reports/progress/:memberId", authenticate, async (req, res) => {
  try {
    const { memberId } = req.params;
    const { months = 6 } = req.query;

    const chartData = [];
    const now = new Date();

    for (let i = parseInt(months) - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

      // Get attendance count
      const attendanceSnap = await db.collection("attendance")
        .where("memberId", "==", memberId)
        .where("status", "==", APPROVAL_STATUS.APPROVED)
        .where("date", ">=", startDate)
        .where("date", "<=", endDate)
        .get();

      // Get gatha
      const gathaSnap = await db.collection("gatha")
        .where("memberId", "==", memberId)
        .where("status", "==", APPROVAL_STATUS.APPROVED)
        .where("date", ">=", startDate)
        .where("date", "<=", endDate)
        .get();

      const gatha = gathaSnap.docs.map((doc) => doc.data());
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      chartData.push({
        month: monthNames[month - 1],
        year,
        attendance: attendanceSnap.docs.length,
        newGatha: gatha.filter((g) => g.type === "new").reduce((sum, g) => sum + (g.totalGatha || 0), 0),
        revision: gatha.filter((g) => g.type === "revision").reduce((sum, g) => sum + (g.totalGatha || 0), 0),
      });
    }

    res.json({ success: true, chartData });
  } catch (error) {
    console.error("Progress chart error:", error);
    res.status(500).json({ success: false, message: "Failed to generate chart data" });
  }
});

// ==================== USER ROUTES ====================

// Get user profile
app.get("/user/profile", authenticate, async (req, res) => {
  res.json({
    success: true,
    user: {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name,
      groupName: req.user.groupName,
      role: req.user.role,
      members: req.user.members || [],
    },
  });
});

// Update user profile
app.put("/user/profile", authenticate, async (req, res) => {
  try {
    const { name, groupName } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (groupName) updates.groupName = groupName;
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection("users").doc(req.user.uid).update(updates);

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
});

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
