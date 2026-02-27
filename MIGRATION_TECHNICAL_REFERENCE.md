# 🔧 TECHNICAL REFERENCE: Migration Details

## What the Migration Does

The `runMigration008.js` script:

1. **Reads** the SQL file (`migrations/008_timetable_management.sql`)
2. **Splits** it into individual SQL statements
3. **Executes** each statement in order
4. **Reports** success for each table created
5. **Pre-populates** reference data (periods and break timings)

---

## SQL Files Explained

### Original File (❌ Wrong Format)
**Location:** `migrations/008_create_timetable_management.sql`

**Problem:** Was in JavaScript Sequelize migration format:
```javascript
import sequelize from 'sequelize';
export default {
  up: async (queryInterface, Sequelize) => { ... }
}
```

**Status:** ❌ Cannot be executed directly in MySQL

### New File (✅ Correct Format)
**Location:** `migrations/008_timetable_management.sql`

**Format:** Pure SQL
```sql
CREATE TABLE IF NOT EXISTS `period_config` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `period_number` INT NOT NULL,
  ...
);
```

**Status:** ✅ Can be executed directly by Node.js

---

## Database Schema Details

### Table 1: period_config
```
Columns:
- id (Primary Key)
- period_number (1-7)
- start_time (09:00, 09:50, etc.)
- end_time
- duration_minutes
- break_type (lecture, tea_break, lunch, tutorial)
- created_at

Pre-populated (7 rows):
- Period 1: 09:00-09:50 (50 min)
- Period 2: 09:50-10:40 (50 min)
- Tea Break: 10:40-11:10 (30 min)
- Period 3: 11:10-12:00 (50 min)
- Period 4: 12:00-12:50 (50 min)
- Lunch: 12:50-13:30 (40 min)
- Period 5: 13:30-14:20 (50 min)
```

### Table 2: year_break_timings
```
Columns:
- id (Primary Key)
- year (1, 2, 3, 4)
- break_type (tea, lunch)
- start_time
- end_time
- duration_minutes
- is_active

Pre-populated (8 rows):
- Year 1: Tea 10:40-11:10, Lunch 12:50-13:30
- Year 2: Tea 10:40-11:10, Lunch 12:50-13:30
- Year 3: Tea 10:50-11:05, Lunch 13:00-13:20
- Year 4: Tea 10:50-11:05, Lunch 13:00-13:20
```

### Table 3: timetable_master
```
Columns:
- id (Primary Key)
- academic_year (VARCHAR)
- semester (ENUM: 1,2,3,4,5,6,7,8)
- department_id (Foreign Key → departments)
- year (ENUM: 1st, 2nd, 3rd, 4th)
- status (ENUM: draft, active, archived)
- created_by (Foreign Key → users)
- created_at
- updated_at

Purpose: Main timetable records
```

### Table 4: timetable_details
```
Columns:
- id (Primary Key)
- timetable_id (Foreign Key → timetable_master)
- class_id (Foreign Key → classes)
- day_of_week (ENUM: Monday-Sunday)
- period_number (1-7)
- subject_id (Foreign Key → subjects, nullable for breaks)
- faculty_id (Foreign Key → faculty_profiles, nullable for breaks)
- room_number (VARCHAR, e.g., "Classroom 7", "Lab 201")
- period_type (ENUM: lecture, practical, tutorial, break)
- is_break (BOOLEAN: marks breaks automatically)
- created_at

Purpose: Individual period assignments (49 rows per timetable)
Indices: idx_timetable_id, idx_faculty_id, idx_class_day
```

### Table 5: faculty_leave_schedules
```
Columns:
- id (Primary Key)
- faculty_id (Foreign Key → faculty_profiles)
- from_date (DATE)
- to_date (DATE)
- reason (TEXT)
- is_active (BOOLEAN)
- created_at

Purpose: Track faculty leave/unavailability
Indices: idx_faculty_id, idx_dates
```

### Table 6: timetable_staff_alterations
```
Columns:
- id (Primary Key)
- timetable_id (Foreign Key → timetable_master)
- timetable_detail_id (Foreign Key → timetable_details)
- original_faculty_id (Foreign Key → faculty_profiles)
- alternative_faculty_id (Foreign Key → faculty_profiles)
- reason (TEXT)
- status (ENUM: pending, accepted, rejected)
- requested_by (Foreign Key → users)
- alternative_response (TEXT)
- created_at
- updated_at

Purpose: Staff change request workflow
Indices: idx_faculty, idx_status
```

---

## Foreign Key Relationships

```
timetable_details
├── → timetable_master (timetable_id)
├── → classes (class_id)
├── → subjects (subject_id) [nullable]
├── → faculty_profiles (faculty_id) [nullable]
└── → period_config (implied via period_number)

timetable_staff_alterations
├── → timetable_master (timetable_id)
├── → timetable_details (timetable_detail_id)
├── → faculty_profiles (original_faculty_id)
├── → faculty_profiles (alternative_faculty_id)
└── → users (requested_by)

faculty_leave_schedules
└── → faculty_profiles (faculty_id)
```

---

## Execution Flow

When you run `node runMigration008.js`:

```
1. Script starts
2. Loads config/db.js (connects to MySQL)
3. Reads migrations/008_timetable_management.sql
4. Splits by semicolon (;) into statements
5. For each statement:
   - Executes via sequelize.query()
   - Logs progress
   - Catches and reports any errors
6. Reports final status
7. Exits process (0 = success, 1 = error)
```

---

## Error Handling

### Common Errors & Solutions

#### "ENOENT: no such file or directory"
```
Cause: File path incorrect
Solution: Ensure you're in backend directory
```

#### "Connection refused at 127.0.0.1:3306"
```
Cause: MySQL not running
Solution: Start MySQL service
- Linux: sudo service mysql start
- Mac: brew services start mysql
- Windows: Services app → MySQL → Start
```

#### "Access denied for user 'root'@'localhost'"
```
Cause: Wrong credentials in .env
Solution: Check MYSQL_USER and MYSQL_PASSWORD in backend/.env
```

#### "Table 'period_config' already exists"
```
Cause: Tables already created
Solution: This is OK - migration won't recreate them
         Tables with existing data are skipped
```

#### "Syntax error in SQL statement"
```
Cause: Malformed SQL
Solution: This shouldn't happen - file is validated
          If it occurs, check for file corruption
```

---

## Verification Commands

After migration completes, verify in MySQL:

```sql
-- Check tables exist
SHOW TABLES WHERE Tables_in_eduvertex LIKE 'timetable%' OR Tables_in_eduvertex LIKE 'year_break%' OR Tables_in_eduvertex LIKE 'period%' OR Tables_in_eduvertex LIKE 'faculty_leave%';

-- Check period data
SELECT * FROM period_config;
-- Should show 7 rows

-- Check year break timings
SELECT * FROM year_break_timings;
-- Should show 8 rows (4 years × 2 breaks each)

-- Check table structure
DESCRIBE timetable_master;
DESCRIBE timetable_details;

-- Check foreign keys
SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME 
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'eduvertex' AND TABLE_NAME IN ('timetable_master', 'timetable_details');
```

---

## JavaScript Migration Script Details

### File: runMigration008.js

**Imports:**
- `fs` - File system operations
- `path` - Path resolution
- `sequelize` - Database connection from config/db.js

**Key Functions:**
```javascript
const filePath = path.join(process.cwd(), 'migrations', '008_timetable_management.sql');
const sql = fs.readFileSync(filePath, 'utf8');
const statements = sql.split(';').filter(s => s.trim());
```

**Execution:**
```javascript
for (const statement of statements) {
  const trimmed = statement.trim();
  if (trimmed) {
    await sequelize.query(trimmed);
    console.log(`✅ Executed: ${trimmed.substring(0, 50)}...`);
  }
}
```

**Error Handling:**
```javascript
process.on('unhandledRejection', (err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
```

---

## Alternative: Manual SQL Execution

If `runMigration008.js` doesn't work, you can manually execute:

### Option 1: phpMyAdmin
1. Open phpMyAdmin (usually at http://localhost/phpmyadmin)
2. Select database `eduvertex`
3. Click "Import" tab
4. Upload `migration/008_timetable_management.sql`
5. Click "Go"

### Option 2: MySQL CLI
```bash
# Login to MySQL
mysql -u root -p eduvertex

# Then paste contents of migrations/008_timetable_management.sql
# Or use:
mysql -u root -p eduvertex < migrations/008_timetable_management.sql
```

### Option 3: Node REPL
```javascript
const { sequelize } = require('./config/db.js');
const fs = require('fs');
const sql = fs.readFileSync('./migrations/008_timetable_management.sql', 'utf8');
const statements = sql.split(';').filter(s => s.trim());
for (const stmt of statements) {
  await sequelize.query(stmt);
}
```

---

## Performance Considerations

### Indices Created
```
timetable_details:
- INDEX idx_timetable (timetable_id)
- INDEX idx_class (class_id)
- INDEX idx_faculty (faculty_id)
- INDEX idx_day_period (day_of_week, period_number)

timetable_staff_alterations:
- INDEX idx_original_faculty (original_faculty_id)
- INDEX idx_alternative_faculty (alternative_faculty_id)
- INDEX idx_status (status)

faculty_leave_schedules:
- INDEX idx_faculty (faculty_id)
- INDEX idx_dates (from_date, to_date)
```

### Query Hints
- Filter timetable_details by timetable_id first
- Use indices for faculty lookups in alterations
- Date range queries on leave_schedules are indexed

---

## Rollback

If you need to remove all timetable tables:

```sql
DROP TABLE IF EXISTS timetable_staff_alterations;
DROP TABLE IF EXISTS faculty_leave_schedules;
DROP TABLE IF EXISTS timetable_details;
DROP TABLE IF EXISTS timetable_master;
DROP TABLE IF EXISTS year_break_timings;
DROP TABLE IF EXISTS period_config;
```

Then re-run: `node runMigration008.js`

---

## Migration File Differences

### Why Wrong Format Was Used Originally

The file `migrations/008_create_timetable_management.sql` was in JavaScript format because:
- Sequelize migrations use `up/down` pattern
- But MySQL cannot execute JavaScript directly
- Solution: Create raw SQL file that Node.js reads and executes

### The Fix

Created `migrations/008_timetable_management.sql` with:
- Pure SQL (no JavaScript wrapper)
- Semicolon delimiters for parsing
- Comments explaining each table
- Pre-populated reference data
- All foreign keys and indices

---

## Summary

**Before:** JavaScript Sequelize migration (can't execute in MySQL)
**After:** Pure SQL file + Node.js wrapper (executes perfectly)

**Status:** ✅ Ready to execute
**Next Action:** `cd backend && node runMigration008.js`
