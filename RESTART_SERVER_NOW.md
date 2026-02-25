# ✅ QUICK RESTART GUIDE

## STEP 1: Stop Current Server
```
In your backend terminal where the server is running:
Press: Ctrl + C
```

## STEP 2: Restart Backend Server
```bash
cd backend
npm start
# OR
node server.js
```

## STEP 3: Verify Server Started
You should see:
```
✓ MySQL Connected: localhost
✓ Server running in development mode on port 5000
```

## STEP 4: Test the Fix
Open browser console and check:
```
GET /api/v1/timetable-management?department_id=1
Status: 200  ✓ (NOT 500 anymore!)
```

## RESULT
- ✅ All 500 errors should be gone
- ✅ TimetableManagement page will now load
- ✅ API calls will work correctly

---

## 🔍 Network Tab Check
After restart, go to SuperAdmin → Timetable:

| Request | Status | Expected |
|---------|--------|----------|
| GET /timetable-management | 200 ✓ | Was 500 ✗ |
| GET /staff-alterations/pending | 200 ✓ | Was 500 ✗ |
| GET /departments | 200 ✓ | Should work |

---

## ⚠️ If Still Getting 500 Errors
1. Check server console for error messages
2. Verify MySQL is running
3. Check browser console for token/auth issues
4. Ensure logged in as SuperAdmin user

---

**FIXED BY:** Added TimetableMaster, TimetableDetails, FacultyLeaveSchedule, TimetableStaffAlteration models to `/backend/models/index.js`
