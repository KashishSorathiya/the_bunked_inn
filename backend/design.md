# 🎯 The Bunked Inn Backend Design Commentary

This document explains the design improvements and software engineering principles applied in the **The Bunked Inn – College Hostel & Complaint Management System** project.

---

## 🏛 1. Overall Architecture

The backend follows the **MVC (Model–View–Controller)** architecture:

| Layer | Purpose |
|:------|:---------|
| **Models** | Database schemas (`User`, `Room`, `Complaint`, `HostelApplication`, `RoomChangeRequest`) |
| **Controllers** | Business logic (e.g., submit complaint, approve hostel, change room) |
| **Routes** | API endpoints connected to frontend |
| **Middleware** | Authentication & Authorization |

✅ **Benefit:** Ensures code is **modular**, **maintainable**, and easier to debug or extend later.

---

## ✅ 2. Design Principles Applied

| Principle | Where Applied | Benefit |
|:-----------|:---------------|:---------|
| **Separation of Concerns** | Routes, controllers, and models placed in separate folders | Cleaner structure and reusable logic |
| **Single Responsibility Principle (SRP)** | Each controller function performs only one action | Easier to test and maintain |
| **DRY (Don’t Repeat Yourself)** | Common logic (e.g., token verification) moved to middleware | Reduced duplication |
| **Database Normalization** | Users, Rooms, Complaints stored as separate collections | Keeps data scalable and clean |
| **Error Handling Standardization** | Unified error responses using `try-catch` and HTTP status codes | Improves debugging & consistency |

---

## 🛠 3. Key Design Improvements

| Area | Before | After Improvement |
|:------|:--------|:------------------|
| **Authentication** | Token verification written inside controllers | Moved to middleware (`authMiddleware.js`) |
| **Complaint Display** | Only complaint text was returned | Added `.populate('userId')` to show student details |
| **Room Allocation** | Manual assignment, repetitive code | Automated allocation with filtering by gender and occupancy |
| **Routing** | Mixed logic in route files | Routes now only define endpoints; logic moved to controllers |

---

## 🔁 4. Refactoring Examples (Good to Have Improvements)

### 🧩 Example 1 — Moved Authentication to Middleware

**Before (token handling repeated in controllers):**
```js
const token = req.headers.authorization;
if (!token) {
  return res.status(401).json({ message: "Unauthorized" });
}

// After (centralized in authMiddleware.js)
app.use(authenticateUser);
Result: Cleaner controllers + reusable authentication logic.
---

## 🧠 Example 2 — Complaint Retrieval Improved Using .populate()
// Before
Complaint.find();
// After
Complaint.find().populate("userId").sort({ createdAt: -1 });
Result: Admin can clearly see which student submitted each complaint, and latest complaints appear first.


🏠 Example 3 — Room Allocation Logic Encapsulated
Room allocation logic is reused in:
    Hostel Application Approval
    Room Change Approval
By placing allocation rules in a helper function, code duplication was removed.

📈 Benefits of Refactoring

| Benefit                      | Explanation                                                |
| ---------------------------- | ---------------------------------------------------------- |
| **More Maintainable Code**   | Modular design makes future edits easier                   |
| **Better Testing Support**   | Each function handles a single job, simplifying unit tests |
| **Performance & Efficiency** | Optimized DB queries (sorting, filtering, population)      |
| **Scalable**                 | New modules (e.g., Warden Dashboard) can be added easily   |
---

📁 File Location

This file is included in the repository at:
backend/design.md

---
🧾 Summary

This design documentation highlights how the project code quality, maintainability, and structure were improved during the development process.