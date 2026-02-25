# 🔧 Database Migration Guide - Timetable Management

## ⚠️ Current Issue
Missing tables in database:
- ❌ `timetable_master` 
- ❌ `timetable_details`
- ❌ `faculty_leave_schedules`
- ❌ `timetable_staff_alterations`
- ❌ `year_break_timings` (optional)

## ✅ Solution

### Step 1: Run Migration via Node Script
Run this command in your backend terminal:

```bash
cd backend
node runMigration008.js
```

**Expected Output:**
```
🔄 Starting Timetable Management Migration (008)...
⏳ Executing: CREATE TABLE IF NOT EXISTS `period_config`...
⏳ Executing: CREATE TABLE IF NOT EXISTS `timetable_master`...
⏳ Executing: CREATE TABLE IF NOT EXISTS `timetable_details`...
⏳ Executing: CREATE TABLE IF NOT EXISTS `faculty_leave_schedules`...
⏳ Executing: CREATE TABLE IF NOT EXISTS `timetable_staff_alterations`...
⏳ Executing: CREATE TABLE IF NOT EXISTS `year_break_timings`...
✅ Migration 008 completed successfully!
📊 Tables created:
   - timetable_master
   - timetable_details
   - faculty_leave_schedules
   - timetable_staff_alterations
   - year_break_timings
   - period_config (updated)
```

### Step 2: Alternative - Manual SQL Execution

If Node script fails, run SQL directly in MySQL/phpMyAdmin:

1. Open MySQL client or phpMyAdmin
2. Select database: `eduvertex`
3. Open file: `backend/migrations/008_timetable_management.sql`
4. Execute all statements

### Step 3: Verify Tables Created

Run in MySQL:
```sql
SHOW TABLES LIKE '%timetable%';
SHOW TABLES LIKE '%period%';
SHOW TABLES LIKE '%leave%';
```

Should show:
```
Tables_in_eduvertex (timetable%)
timetable_master
timetable_details
timetable_staff_alterations

Tables_in_eduvertex (period%)
period_config

Tables_in_eduvertex (leave%)
faculty_leave_schedules
year_break_timings
```

### Step 4: Restart Backend Server

```bash
# In backend terminal, press Ctrl+C to stop

# Then restart
npm start
```

## 📋 What Gets Created

### 1. `timetable_master` - Main Timetable Records
| Column | Type | Purpose |
|--------|------|---------|
| id | INT | Primary key |
| name | VARCHAR(255) | Timetable name |
| academic_year | VARCHAR(20) | "2024-2025" |
| semester | ENUM | 'odd' or 'even' |
| department_id | INT | Department reference |
| year | ENUM | '1st', '2nd', '3rd', '4th' |
| timetable_incharge_id | INT | HOD/Incharge faculty |
| status | ENUM | draft, pending_approval, active, inactive |
| created_by | INT | SuperAdmin who created |
| approved_by | INT | Who approved (if applicable) |

### 2. `timetable_details` - 7 Periods Per Day (49 Records per Timetable)
| Column | Type | Purpose |
|--------|------|---------|
| id | INT | Primary key |
| timetable_id | INT | FK to timetable_master |
| class_id | INT | Which class gets this period |
| day_of_week | ENUM | Monday-Saturday |
| period_number | INT | 1-7 (7 periods per day) |
| subject_id | INT | What subject is taught |
| faculty_id | INT | Who teaches it |
| room_number | VARCHAR(50) | Classroom 7, Lab 201, etc |
| period_type | ENUM | lecture, practical, tutorial, break, lunch |
| is_break | BOOLEAN | TRUE for break/lunch periods |

### 3. `faculty_leave_schedules` - When Faculty Are Unavailable
| Column | Type | Purpose |
|--------|------|---------|
| faculty_id | INT | FK to faculty_profiles |
| from_date | DATE | Leave start date |
| to_date | DATE | Leave end date |
| is_active | BOOLEAN | Is this leave active |
| reason | TEXT | Why they're on leave |

### 4. `timetable_staff_alterations` - Staff Change Requests
| Column | Type | Purpose |
|--------|------|---------|
| timetable_id | INT | Which timetable |
| timetable_detail_id | INT | Which period needs change |
| original_faculty_id | INT | Current faculty (going on leave) |
| alternative_faculty_id | INT | Replacement faculty |
| reason | TEXT | Why change needed |
| status | ENUM | pending, accepted, rejected |
| requested_by | INT | Who requested |
| accepted_at | TIMESTAMP | When was it accepted |

### 5. `period_config` - Period Timing Configuration
Pre-populated data:
```
Period 1: 09:00 - 09:50 (50 min lecture)
Period 2: 09:50 - 10:40 (50 min lecture)
Period 3: 10:40 - 11:10 (30 min - Tea Break)
Period 4: 11:10 - 12:00 (50 min lecture)
Period 5: 12:00 - 12:50 (50 min lecture)
Period 6: 12:50 - 13:30 (40 min - Lunch Break)
Period 7: 13:30 - 14:20 (50 min lecture)
```

### 6. `year_break_timings` - Year-Specific Break Timings
Pre-populated data:
```
1st & 2nd Year:
  - Tea Break: 10:40-11:10 (30 min)
  - Lunch: 12:50-13:30 (40 min)

3rd & 4th Year:
  - Tea Break: 10:40-11:00 (20 min - shorter)
  - Lunch: 12:50-13:20 (30 min - shorter)
```

## 🧪 Test After Migration

Once tables are created and server is running:

1. **Check Dashboard Loads**: Go to `/admin/superadmin/timetable`
   - Should NOT see 500 errors
   - Should see empty timetable list

2. **Test API Endpoints**:
```bash
# Get all timetables (should be empty array)
curl http://localhost:5000/api/v1/timetable-management \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return:
# {"success": true, "data": []}

# Get pending alterations (should be empty array)
curl http://localhost:5000/api/v1/timetable-management/staff-alterations/pending \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return:
# {"success": true, "data": []}
```

## ✅ Troubleshooting

### Error: "Table already exists"
**Solution:** All statements use `CREATE TABLE IF NOT EXISTS`, so they're safe to run multiple times.

### Error: "Foreign key constraint fails"
**Check:**
- Database has tables: departments, users, classes, subjects, faculty_profiles
- All reference tables exist before running migration

### Error: "Access denied for user"
**Check:**
- MySQL user has permissions for the eduvertex database
- Connection string in .env is correct

### Error: "Cannot find file 008_timetable_management.sql"
**Solution:** Ensure file exists at:
```
backend/migrations/008_timetable_management.sql
```

## 📊 Database Verification Query

After migration, run this to verify:

```sql
-- Check table count
SELECT COUNT(*) as total_tables FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'eduvertex' AND TABLE_NAME LIKE '%timetable%';

-- Should return: 4 tables (timetable_master, timetable_details, timetable_staff_alterations, + 1 more)

-- Check period_config has data
SELECT COUNT(*) as period_count FROM period_config;
-- Should return: 7 (7 periods created)

-- Check break timings
SELECT DISTINCT year, COUNT(*) as breaks FROM year_break_timings GROUP BY year;
-- Should return 4 rows (1st, 2nd, 3rd, 4th year each with break data)
```

## 🎉 Success Indicators

After running migration, you should have:
- ✅ All 6 tables created
- ✅ Period configuration populated (7 periods)
- ✅ Break timings configured (4 year levels)
- ✅ No 500 errors in API calls
- ✅ Timetable Management page loads
- ✅ Can create new timetables

---

**Next Steps:** 
1. Run migration
2. Verify tables exist
3. Restart server
4. Test dashboard
5. Create your first timetable!
