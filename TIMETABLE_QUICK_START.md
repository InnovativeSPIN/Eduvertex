# 🚀 TIMETABLE SYSTEM: Database Migration & Setup

## ⚠️ Current Issue
The timetable system is returning database errors:
```
Error: Table 'eduvertex.timetable_staff_alterations' doesn't exist
```

## ✅ Solution Status
All code is ready. Database tables just need to be created. **Follow these 4 steps:**

---

## 🎯 Quick Start (4 Steps)

### Step 1: Create Database Tables (2 minutes)
```bash
cd backend
node runMigration008.js
```

**Expected Output:**
```
✅ Migration 008 completed successfully!
📊 Tables created:
   - period_config
   - year_break_timings
   - timetable_master
   - timetable_details
   - faculty_leave_schedules
   - timetable_staff_alterations
```

### Step 2: Verify Database Setup (1 minute)
```bash
node verifyDatabase.js
```

**Look for:** All 6 tables showing ✅

### Step 3: Restart Backend Server (1 minute)
```bash
npm start
```

### Step 4: Test in Browser
Navigate to: **http://localhost:3000/admin/superadmin/timetable**

You should see the Timetable Management Dashboard without errors.

---

## 📊 What Gets Created

| Table | Records | Purpose |
|-------|---------|---------|
| period_config | 7 | System periods (09:00-14:20) |
| year_break_timings | 4 | Break timings for each year level |
| timetable_master | 0 | Timetable records (you create these) |
| timetable_details | 0 | Individual periods per timetable (49 per timetable) |
| faculty_leave_schedules | 0 | Faculty leave tracking |
| timetable_staff_alterations | 0 | Staff change workflow |

---

## 📋 After Migration - Create a Timetable (Admin)

### Using the API:
```bash
curl -X POST http://localhost:5000/api/v1/timetable-management \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "CSE A - Semester 6 - Odd 2024",
    "academic_year": "2024-2025",
    "semester": "odd",
    "department_id": 1,
    "year": "3rd"
  }'
```

### Using the UI:
1. Go to Admin Dashboard → Timetable Management
2. Click "Create Timetable"
3. Fill in the form:
   - Name: "CSE A - Semester 6 - Odd 2024"
   - Department: CSE
   - Academic Year: 2024-2025
   - Semester: Odd
   - Year: 3rd
4. Click "Create"

## Step 3: Bulk Upload Timetable Periods

### Create CSV File (timetable.csv):
```csv
class_id,day_of_week,period_number,subject_id,faculty_id,room_number,period_type,is_break
1,Monday,1,101,1,Classroom 7,lecture,false
1,Monday,2,102,2,Classroom 7,lecture,false
1,Monday,3,,,,break,true
1,Monday,4,103,3,Lab 201,practical,false
1,Monday,5,104,4,Classroom 8,lecture,false
1,Monday,6,,,,lunch,true
1,Monday,7,105,5,Classroom 9,tutorial,false
1,Tuesday,1,101,1,Classroom 7,lecture,false
1,Tuesday,2,102,2,Classroom 7,lecture,false
1,Tuesday,3,,,,break,true
1,Tuesday,4,103,3,Lab 201,practical,false
1,Tuesday,5,104,4,Classroom 8,lecture,false
1,Tuesday,6,,,,lunch,true
1,Tuesday,7,105,5,Classroom 9,tutorial,false
```

**Note:** The `room_number` column accepts any classroom location like:
- `Classroom 7`, `Room 101`, `Lab 201`
- It will display as "📍 Classroom 7" in the timetable

### Upload via API:
```bash
curl -X POST http://localhost:5000/api/v1/timetable-management/bulk-upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
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
  }'
```

### Upload via UI:
1. Go to Timetable Management
2. Click "Bulk Upload"
3. Select the timetable from dropdown
4. Click on file area and select CSV
5. Click "Upload Subjects"

## Step 4: View Faculty Timetable

### Using the API:
```bash
curl http://localhost:5000/api/v1/timetable-management/faculty/1 \
  -H "Authorization: Bearer FACULTY_TOKEN" \
  -H "academic_year=2024-2025" \
  -H "semester=odd"
```

### Using the UI:
1. Faculty logs in
2. Go to Dashboard → My Timetable
3. View personal schedule
4. If on leave, alert will show
5. Can download timetable

## Step 5: View Class Timetable (Student)

### Using the API:
```bash
curl http://localhost:5000/api/v1/timetable-management/class/1/timetable/1 \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

### Using the UI:
1. Student logs in
2. Go to Dashboard → My Class Timetable
3. Select class
4. View complete schedule with break timings
5. Export or share

## Step 6: Test Staff Alteration

### Request Alteration (Admin):
```bash
curl -X POST http://localhost:5000/api/v1/timetable-management/staff-alterations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "timetable_id": 1,
    "timetable_detail_id": 5,
    "original_faculty_id": 1,
    "alternative_faculty_id": 2,
    "reason": "Faculty on medical leave from Feb 25 to Mar 5"
  }'
```

### Get Pending Alterations:
```bash
curl http://localhost:5000/api/v1/timetable-management/staff-alterations/pending \
  -H "Authorization: Bearer FACULTY_TOKEN"
```

### Accept Alteration (Alternative Faculty):
```bash
curl -X PUT http://localhost:5000/api/v1/timetable-management/staff-alterations/1/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ALTERNATIVE_FACULTY_TOKEN" \
  -d '{
    "response": "I can take these classes"
  }'
```

### Reject Alteration:
```bash
curl -X PUT http://localhost:5000/api/v1/timetable-management/staff-alterations/1/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ALTERNATIVE_FACULTY_TOKEN" \
  -d '{
    "reason": "I have other commitments"
  }'
```

## Step 7: Test Break Timings

### Get Break Timings for Year:
```bash
curl "http://localhost:5000/api/v1/timetable-management/class/1/timetable/1" \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

**Response includes:**
- Break timings specific to the class year level
- 1st & 2nd year: Longer breaks
- 3rd & 4th year: Shorter, tighter schedule

## Test Data

### Sample Insert for Testing:

```sql
-- Create test department
INSERT INTO departments (short_name, full_name) VALUES ('CSE', 'Computer Science');

-- Create test class
INSERT INTO classes (name, section, room, department_id, semester, batch, capacity) 
VALUES ('CSE A', 'A', '101', 1, 6, '2022-2026', 60);

-- Create test subject
INSERT INTO subjects (subject_code, subject_name, department_id, semester, sem_type, credits) 
VALUES ('CS601', 'Advanced Algorithms', 1, 6, 'odd', 4);

-- Create test faculty
INSERT INTO faculty_profiles (first_name, last_name, email, department_id) 
VALUES ('John', 'Doe', 'john@college.edu', 1);

-- Create timetable
INSERT INTO timetable_master (name, academic_year, semester, department_id, year, created_by) 
VALUES ('CSE A - Sem 6 - Odd', '2024-2025', 'odd', 1, '3rd', 1);

-- Create timetable detail with classroom location
INSERT INTO timetable_details 
(timetable_id, class_id, day_of_week, period_number, subject_id, faculty_id, room_number) 
VALUES (1, 1, 'Monday', 1, 1, 1, 'Classroom 7');

-- Create another timetable detail with lab location
INSERT INTO timetable_details 
(timetable_id, class_id, day_of_week, period_number, subject_id, faculty_id, room_number) 
VALUES (1, 1, 'Monday', 2, 1, 1, 'Lab 201');
```

### Classroom Location Format:
The `room_number` column stores the classroom location. Supported formats:
- **Classroom naming:** `Classroom 1`, `Classroom 7`, `Classroom A101`
- **Lab rooms:** `Lab 101`, `Lab 201`, `CSE Lab`
- **Building system:** `A101`, `B202`, `Block 3`
- **Custom format:** Any text format is supported

### Classroom Display in UI:
- **In timetable grid:** 📍 Classroom 7
- **In faculty view:** 📍 Classroom 7
- **In student view:** 📍 Classroom 7
- **In download:** [Classroom: Classroom 7]

## Verification Checklist

- [ ] Period configuration initialized (7 periods visible)
- [ ] Timetable created successfully
- [ ] CSV bulk upload works
- [ ] Faculty can view personal timetable
- [ ] Student can view class timetable with breaks
- [ ] Break timings differ for different years
- [ ] Staff alteration request can be sent
- [ ] Alternative faculty receives notification
- [ ] Alteration can be accepted/rejected
- [ ] Period updates when alteration accepted

## Common Issues & Solutions

### Issue: "Timetable not found"
**Solution:** Ensure timetable_id exists and is created before bulk upload

### Issue: "Period configuration not loading"
**Solution:** Run `initializePeriodConfig.js` again

### Issue: "Faculty not visible in timetable"
**Solution:** Check faculty_id is correct and faculty exists in database

### Issue: "Break timings not showing"
**Solution:** Ensure year_break_timings table is populated for the correct year level

## Performance Tips

1. **Bulk Upload:** Use CSV for adding 50+ periods (faster than manual)
2. **Filtering:** Use department_id to narrow down timetable list
3. **Caching:** Period configuration is often static - can be cached
4. **Indexing:** Database queries are indexed on commonly filtered fields

## Next Steps

1. Test all endpoints with your data
2. Integrate notification system
3. Add conflict detection
4. Implement approval workflow
5. Deploy to production

---

**Last Updated:** February 25, 2026
