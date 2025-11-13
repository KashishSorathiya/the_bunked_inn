#  The Bunked Inn Backend Test Coverage Summary

This document summarizes the test cases written for the **College Hostel Complaint System** backend.  
All tests are implemented using **Jest** and are located inside the `tests/` directory.

## Test Files Location
All test files are located in:

```
backend/tests/
```

| Test File | Module Covered | Purpose |
|----------|---------------|---------|
| `authMiddleware.test.js` | Authentication & Authorization | Ensures login token validation and role-based access control |
| `hostelApplicationController.test.js` | Hostel Application Module | Tests student hostel application creation & admin approval behavior |
| `complaintController.test.js` | Complaint Handling Module | Ensures complaint submission, retrieval, and status updates work |
| `roomChangeController.test.js` | Room Change Request Module | Tests request creation, processing, and admin update actions |


## Key Functionalities Covered

### 1. **Authentication & Authorization Middleware**
- Checks if token is missing → returns `401 Unauthorized`
- Checks if token is invalid → returns `401 Unauthorized`
- Valid token allows access → `next()` is called
- Role restriction tested:
  - Admin-only routes allow **admin**
  - Other roles receive `403 Forbidden`

### 2. **Hostel Application Controller**
- Student can submit hostel application
- Fetch all pending hostel applications
- Approving an application triggers:
  - Auto room allocation logic
  - User allocation status update

### 3. **Complaint Controller**
- Student can submit complaints
- Complaints retrieve with student details (`populate`)
- Admin can resolve complaints
- Complaints sorted by most recent first

### 4. **Room Change Controller**
- Student can submit a room change request
- Admin can approve or reject requests with reason
- When approved:
  - Rooms updated accordingly in database
  - Previous room occupant removed
  - New room occupant assignment happens


## Test Status Overview

| Module | Completion | Test Result |
|--------|------------|-------------|
| Authentication Middleware |  Completed |  Passed |
| Hostel Application |  Completed |  Passed |
| Complaint Controller | Completed |  Passed |
| Room Change Controller |  Completed |  Passed |


## How to Run Tests

Run the following command inside the `backend` folder:

```
cd backend
npm test
```

## Notes
- All tests use **Jest**
- Database calls are **mocked** to ensure fast and isolated testing

 **GitHub Path:** `backend/tests/`

**This testing suite ensures core system workflow is validated and stable.**
