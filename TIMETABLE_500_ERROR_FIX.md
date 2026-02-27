# Timetable Management - 500 Error Fix Guide

## Problem Summary
The API endpoints were returning 500 errors because the new timetable management models (TimetableMaster, TimetableDetails, FacultyLeaveSchedule, TimetableStaffAlteration) were not registered in the Sequelize models index.

## ✅ Fix Applied

### 1. Updated `/backend/models/index.js`
Added the following imports and model registrations:
- Imported: TimetableMaster, TimetableDetails, FacultyLeaveSchedule, TimetableStaffAlteration
- Registered all 4 models in the `models` object
- All associations are properly set up

### 2. Verified Database
- Migration `008_create_timetable_management.sql` creates all required tables
- Confirmed all new model files exist and are properly exported

## 🔄 How to Restart the Server

### Option 1: Kill and Restart
```bash
# In your backend terminal:
# Press Ctrl+C to stop the current server

# Then restart:
npm start
# OR
node server.js
```

### Option 2: If Using Package.json Script
```bash
npm run dev  # if you have a dev script
# OR
node --watch server.js  # with auto-reload
```

## 🧪 Testing After Restart

Once the server restarts, test these endpoints:

### 1. Get All Timetables (Should return empty array initially)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/v1/timetable-management
```

Expected response:
```json
{
  "success": true,
  "data": []
}
```

### 2. Create a Timetable (SuperAdmin only)
```bash
curl -X POST http://localhost:5000/api/v1/timetable-management \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "CSE A - 2024-2025",
    "academic_year": "2024-2025",
    "semester": "odd",
    "department_id": 1,
    "year": "3rd"
  }'
```

### 3. Get Period Configuration
```bash
curl http://localhost:5000/api/v1/timetable-management/periods/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📋 What Was Fixed

| Error | Cause | Fix |
|-------|-------|-----|
| `TypeError: Cannot read properties of undefined (reading 'findAll')` | TimetableMaster model not registered | Added to models/index.js |
| `TypeError: Cannot read properties of undefined (reading 'create')` | TimetableDetails model not registered | Added to models/index.js |
| API 500 errors on /timetable-management/* endpoints | Models not available during controller initialization | Registered all 4 new models |

## ✨ Models Now Registered

✅ TimetableMaster - Main timetable records
✅ TimetableDetails - Individual periods (7 per day)
✅ FacultyLeaveSchedule - Faculty leave tracking
✅ TimetableStaffAlteration - Staff change requests

## 🚀 Next Steps

1. **Restart the server** (see instructions above)
2. **Test the endpoints** (see testing section)
3. Log in to SuperAdmin dashboard
4. Navigate to `/admin/superadmin/timetable`
5. Create your first timetable and start building schedules!

## Debug Checklist

After restart, if still getting errors, check:
- [ ] Server shows "MySQL Connected" message
- [ ] No "Cannot find module" errors
- [ ] All 4 new models appear in console logs during initialization
- [ ] TimetableManagement.tsx component loads without console errors
- [ ] Network tab shows 200 response (not 500)

## Common Issues

**Issue:** "Cannot find module './TimetableMaster.model.js'"
- **Solution:** Verify all 4 model files exist in `/backend/models/`

**Issue:** Still getting 500 errors after restart
- **Solution:** Check database connection with `npm run test:db` (if available)
- **Backup:** Re-run migration: `node backend/runMigration008.js`

**Issue:** 401 Unauthorized errors
- **Solution:** Ensure you're using a valid JWT token from login
- **Token:** Available in browser localStorage after successful login

## Database Tables Created

```sql
- timetable_master
- timetable_details  
- faculty_leave_schedules
- timetable_staff_alterations
- period_config (already existed)
- year_break_timings (already existed)
```

All tables have proper indices and foreign keys configured.
