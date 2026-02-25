# Timetable Management System - Complete Routes & Flow Guide

## System Architecture Overview

```
SUPERADMIN (Creates Timetables)
    ↓
/api/v1/timetable-management (SuperAdmin Routes)
    ↓
DEPARTMENT TIMETABLE INCHARGE (Manages/Edits)
    ↓
/api/v1/department-admin/timetable (Department Admin Routes)
    ↓
FACULTY (Views Personal Schedule)
    ↓
STUDENTS (Views Class Schedule)
```

## Route Hierarchy

### 1. SuperAdmin Timetable Management Routes
**Base URL:** `/api/v1/timetable-management`
**Protected By:** SuperAdmin authorization
**Page:** `/admin/superadmin/timetable`

#### Create Timetable
- **Route:** `POST /api/v1/timetable-management`
- **Authorization:** SuperAdmin only
- **Request Body:**
```json
{
  "name": "CSE A - Semester 6 - Odd 2024",
  "academic_year": "2024-2025",
  "semester": "odd",
  "department_id": 1,
  "year": "3rd"
}
```
- **Response:** Created timetable with id
- **UI:** TimetableManagement.tsx → Create Timetable Form

#### Get All Timetables (with Filters)
- **Route:** `GET /api/v1/timetable-management?department_id=1&academic_year=2024-2025&semester=odd&year=3rd&status=active`
- **Authorization:** SuperAdmin
- **Response:** Array of timetables
- **UI:** TimetableManagement.tsx → Timetable List with Filters

#### Get Single Timetable Details
- **Route:** `GET /api/v1/timetable-management/:id`
- **Authorization:** SuperAdmin
- **Response:** Timetable with all periods and details
- **UI:** TimetableManagement.tsx → View Details

#### Bulk Upload Timetable Periods
- **Route:** `POST /api/v1/timetable-management/bulk-upload`
- **Authorization:** SuperAdmin only
- **Request Body:**
```json
{
  "timetable_id": 1,
  "details": [
    {
      "class_id": 1,
      "day_of_week": "Monday",
      "period_number": 1,
      "subject_id": 101,
      "faculty_id": 1,
      "room_number": "Classroom 7"
    }
  ]
}
```
- **Response:** 207 Multi-Status (per-row error handling)
- **UI:** TimetableManagement.tsx → Bulk Upload Modal with CSV

#### Period Configuration Routes
- **Route:** `GET /api/v1/timetable-management/periods/:department_id`
  - Gets period timing (7 periods with breaks)
  - Auth: SuperAdmin
  - Response: Array of periods with times

- **Route:** `POST /api/v1/timetable-management/periods`
  - Creates period configuration
  - Auth: SuperAdmin only
  - Request: Period details
  - Response: Created period config

#### Staff Alteration Routes
- **Route:** `POST /api/v1/timetable-management/staff-alterations`
  - Request staff change (when faculty on leave)
  - Auth: SuperAdmin
  - Request: original_faculty_id, alternative_faculty_id, reason, timetable_detail_id
  - Response: Alteration request created

- **Route:** `GET /api/v1/timetable-management/staff-alterations/pending`
  - Get pending alteration requests
  - Auth: Any authenticated user
  - Response: Array of pending alterations

- **Route:** `PUT /api/v1/timetable-management/staff-alterations/:id/accept`
  - Alternative faculty accepts alteration
  - Auth: Faculty
  - Request: { response: "Acceptance message" }
  - Response: Updates timetable_details with new faculty_id

- **Route:** `PUT /api/v1/timetable-management/staff-alterations/:id/reject`
  - Faculty rejects alteration
  - Auth: Faculty
  - Request: { reason: "Rejection reason" }
  - Response: Alteration marked as rejected

#### Faculty/Student View Routes
- **Route:** `GET /api/v1/timetable-management/faculty/:faculty_id`
  - Gets personal faculty timetable
  - Auth: Public (with season/year params)
  - Query: `?academic_year=2024-2025&semester=odd`
  - Response: Faculty's all scheduled periods

- **Route:** `GET /api/v1/timetable-management/class/:class_id/timetable/:timetable_id`
  - Gets class timetable for students
  - Auth: Public
  - Response: Class schedule with break timings

---

### 2. Department Admin Timetable Management Routes
**Base URL:** `/api/v1/department-admin/timetable`
**Protected By:** Department Timetable Incharge authorization
**Page:** `/admin/department-admin/timetable`
**Component:** TimetableEditor.tsx

#### Get Timetables by Department & Year
- **Route:** `GET /api/v1/department-admin/timetable/department/:year`
- **Auth:** Department Timetable Incharge only
- **Response:** Timetables for HOD's department
- **Middleware:** `checkTimetableIncharge` - Validates user is HOD

#### Create Timetable (Department Level)
- **Route:** `POST /api/v1/department-admin/timetable/create`
- **Auth:** Department Timetable Incharge
- **Request:** { year, session_start, session_end, is_published }
- **Response:** Created timetable
- **Note:** Prevents duplicates for same year

#### Update Timetable
- **Route:** `PUT /api/v1/department-admin/timetable/:id`
- **Auth:** Department Timetable Incharge
- **Request:** { year?, session_start?, session_end?, is_published? }
- **Response:** Updated timetable

#### Get Slot Assignments
- **Route:** `GET /api/v1/department-admin/timetable/:timetable_id/slots`
- **Auth:** Department Timetable Incharge
- **Response:** All periods for this timetable

#### Assign Faculty to Slot
- **Route:** `POST /api/v1/department-admin/timetable/slots/assign`
- **Auth:** Department Timetable Incharge
- **Request:**
```json
{
  "timetable_id": 1,
  "class_id": 1,
  "subject_code": "CS601",
  "subject_name": "Advanced Algorithms",
  "faculty_id": 1,
  "day_of_week": "Monday",
  "start_time": "09:00",
  "end_time": "10:00",
  "room_number": "Classroom 7"
}
```
- **Response:** Slot assignment created
- **Validation:** One faculty → One subject per class per session

#### Change Faculty Assignment
- **Route:** `PUT /api/v1/department-admin/timetable/slots/:assignment_id/reassign`
- **Auth:** Department Timetable Incharge
- **Request:** { faculty_id: new_faculty_id }
- **Response:** Assignment updated

#### Delete Slot Assignment
- **Route:** `DELETE /api/v1/department-admin/timetable/slots/:assignment_id`
- **Auth:** Department Timetable Incharge
- **Response:** Assignment deleted

#### Get Available Faculty
- **Route:** `GET /api/v1/department-admin/timetable/slots/available-faculty`
- **Auth:** Department Timetable Incharge
- **Query:** ?class_id=1&time_slot=09:00-10:00&day=Monday
- **Response:** Faculty not scheduled at that time

#### Publish Timetable
- **Route:** `POST /api/v1/department-admin/timetable/:timetable_id/publish`
- **Auth:** Department Timetable Incharge
- **Response:** Timetable marked as published

---

## Complete Data Flow

### 1. Creating a Timetable (SuperAdmin)
```
SuperAdmin Dashboard
    ↓
/admin/superadmin/timetable
    ↓
TimetableManagement.tsx (Create Form)
    ↓
POST /api/v1/timetable-management
    ↓
Backend: createTimetable() creates TimetableMaster record
    ↓
Timetable Created (status: draft)
```

### 2. Adding Periods to Timetable (SuperAdmin)
```
TimetableManagement.tsx (Bulk Upload)
    ↓
CSV File Upload (class_id, day, period, subject, faculty, room)
    ↓
POST /api/v1/timetable-management/bulk-upload
    ↓
Backend: bulkUploadTimetable() creates TimetableDetails records
    ↓
207 Multi-Status Response (success/errors per row)
    ↓
Periods Assigned
```

### 3. Department Timetable Incharge Editing (HOD)
```
HOD Login
    ↓
Navigate to Timetable (/admin/department-admin/timetable)
    ↓
TimetableEditor.tsx Loads
    ↓
GET /api/v1/department-admin/timetable/department/3rd
    ↓
Displays timetables for 3rd year (HOD's department)
    ↓
Can Edit:
  - Assign faculty to slots
  - Change faculty assignments
  - Delete slot assignments
  - Publish timetable
```

### 4. Faculty Viewing Personal Timetable
```
Faculty Login
    ↓
Dashboard → My Timetable
    ↓
GET /api/v1/timetable-management/faculty/:faculty_id?academic_year=2024-2025&semester=odd
    ↓
Backend: Fetches FacultyTimetable, checks FacultyLeaveSchedule
    ↓
If On Leave: Alert shown
    ↓
Display 7 periods × 6 days table
    ↓
Shows: Subject Code, Class, Faculty (self), Classroom Location
```

### 5. Student Viewing Class Timetable
```
Student Login
    ↓
Dashboard → Class Timetable
    ↓
GET /api/v1/timetable-management/class/:class_id/timetable/:timetable_id
    ↓
Also GET /api/v1/timetable-management/periods/:department_id
    ↓
Display class timetable with:
  - 7 periods × 6 days
  - Subject code, Faculty name, Classroom location
  - Break timings (different for 1st/2nd vs 3rd/4th year)
```

### 6. Staff Alteration Workflow
```
Faculty On Leave (Request initiated by SuperAdmin)
    ↓
POST /api/v1/timetable-management/staff-alterations
  - original_faculty_id: Faculty on leave
  - alternative_faculty_id: Replacement faculty
  - Reason: "Medical leave Feb 25 - Mar 5"
    ↓
TimetableStaffAlteration Record Created (status: pending)
    ↓
Alternative Faculty Notified
    ↓
Faculty Views Pending Alterations
  GET /api/v1/timetable-management/staff-alterations/pending
    ↓
Faculty Accepts/Rejects
  - PUT /staff-alterations/:id/accept → Updates period faculty_id
  - PUT /staff-alterations/:id/reject → Mark rejected
    ↓
If Accepted: TimetableDetails.faculty_id updated
If Rejected: Next alternative faculty notified
```

---

## Key Features by Role

### SuperAdmin
✅ Create timetables
✅ Bulk upload periods  
✅ View all timetables across departments
✅ Request staff alterations  
✅ Configure periods & break timings

### Department Timetable Incharge (HOD)
✅ Edit timetables for their department
✅ Assign faculty to slots
✅ Change faculty assignments  
✅ Delete slot assignments
✅ Publish timetables
❌ Cannot create new timetables (SuperAdmin only)

### Faculty
✅ View personal timetable
✅ See leave status
✅ Accept/Reject staff alteration requests
✅ Download personal schedule
✅ Share schedule

### Student
✅ View class timetable
✅ See all faculty names
✅ See classroom locations
✅ See break timings (year-specific)
✅ Download schedule

---

## Period Configuration

### Structure
- **7 Periods per day:** 09:00 - 14:20
- **Period Duration:** 50 minutes
- **Breaks:** Lunch & Tea breaks

### Break Timings
**1st & 2nd Year:**
- Tea Break (Period 2-3): 10:40 - 11:10 (30 min)
- Lunch (Period 5-6): 12:50 - 01:30 (40 min)

**3rd & 4th Year:**
- Tea Break (Period 2-3): 10:50 - 11:10 (20 min)
- Lunch (Period 5-6): 01:00 - 01:30 (30 min)

### Day Structure
Monday - Saturday (6 days/week)

---

## Authorization & Middleware

### protect middleware
- Checks if user is authenticated
- Required on all routes

### authorize('superadmin', 'super-admin')
- Only superadmins can:
  - POST /timetable-management (create)
  - POST /timetable-management/bulk-upload
  - POST /timetable-management/periods
  - POST /timetable-management/staff-alterations

### checkTimetableIncharge (Department Admin)
- Validates user is faculty with is_timetable_incharge = true
- Validates user.department_id matches timetable department

---

## Error Handling

### 400 Bad Request
- Missing required fields
- Invalid data format
- Duplicate timetable for year

### 403 Forbidden
- SuperAdmin endpoints accessed by non-superadmin
- Department endpoints accessed by wrong department
- Faculty alteration without proper role

### 404 Not Found
- Timetable not found
- Faculty not found
- Period configuration missing

### 409 Conflict
- Duplicate timetable for year/department

### 207 Multi-Status
- Bulk upload with per-row errors
- Some rows succeed, some fail

---

## Common Issues & Solutions

### Issue: GET /periods/:department_id returns 404
**Solution:** Ensure period configuration is initialized
```bash
node backend/initializePeriodConfig.js
```

### Issue: Faculty cannot see alteration requests
**Solution:** Check `GET /api/v1/timetable-management/staff-alterations/pending`
- Faculty must be logged in
- Alternative faculty ID must match their ID

### Issue: Timetable not showing in department admin
**Solution:** 
- User must be faculty with is_timetable_incharge = true
- User department must match timetable department

### Issue: Wrong break timings displaying
**Solution:**
- Check year_break_timings table populated
- Verify class semester value (1-2 vs 3-4)

---

## Migration & Initialization

### 1. Run Database Migration
```bash
cd backend
npm run migrate:create 008_create_timetable_management
```

### 2. Initialize Period Configuration
```bash
node initializePeriodConfig.js
```

### 3. Test Routes
```bash
# Test period config
curl http://localhost:5000/api/v1/timetable-management/periods/1 \
  -H "Authorization: Bearer TOKEN"

# Test create timetable
curl -X POST http://localhost:5000/api/v1/timetable-management \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SUPERADMIN_TOKEN" \
  -d '{"name":"Test","academic_year":"2024-2025","semester":"odd","department_id":1,"year":"3rd"}'
```

---

## Frontend Navigation

### SuperAdmin Path
Dashboard → Timetable Management
- Route: `/admin/superadmin/timetable`
- Component: TimeTable.tsx → TimetableManagement.tsx

### Department Admin Path
Dashboard → Timetable (in sidebar)
- Route: `/admin/department-admin/timetable`
- Component: TimetableEditor.tsx

### Faculty Path
Dashboard → My Timetable
- Component: FacultyTimetable.tsx

### Student Path
Dashboard → My Class Timetable  
- Component: ClassTimetable.tsx

---

## Testing Checklist

- [ ] Period configuration initialized (7 periods visible)
- [ ] Timetable creation works (superadmin)
- [ ] Bulk upload accepts CSV
- [ ] Department admin can edit slots
- [ ] Faculty can view personal timetable
- [ ] Student can view class timetable
- [ ] Break timings differ by year
- [ ] Classroom location displays with 📍 icon
- [ ] Staff alteration notification works
- [ ] Leave status alerts faculty
- [ ] Download generates correct text format
