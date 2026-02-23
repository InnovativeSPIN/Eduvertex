# Subject Management System - Quick Command Reference

## 🚀 Fastest Way to Get Started

### Option 1: Windows Command Line

```batch
REM Navigate to project
cd c:\Users\thanu\Documents\Projects\Eduvertex

REM Execute migration
mysql -u root -p -h localhost eduvertex < backend/migrations/001_create_subjects_table.sql

REM Enter your MySQL password when prompted

REM Verify tables created
mysql -u root -p -h localhost -e "USE eduvertex; SHOW TABLES LIKE 'subject%';"
```

### Option 2: PowerShell

```powershell
# Navigate to project
Set-Location "c:\Users\thanu\Documents\Projects\Eduvertex"

# Execute migration
mysql -u root -p -h localhost eduvertex < backend/migrations/001_create_subjects_table.sql

# Verify tables
mysql -u root -p -h localhost eduvertex -e "SHOW TABLES LIKE 'subject%';"
```

### Option 3: MySQL Workbench (GUI)

1. Open MySQL Workbench
2. Go to File → Open SQL Script
3. Navigate to `backend/migrations/001_create_subjects_table.sql`
4. Click Execute (⚡)
5. Verify success in output

---

## Verification Commands

```sql
-- After migration, verify tables exist
SHOW TABLES LIKE 'subject%';

-- Check subjects table structure
DESCRIBE subjects;

-- Check faculty assignments table
DESCRIBE faculty_subject_assignments;

-- Check sample data was inserted
SELECT COUNT(*) FROM subjects;
SELECT code, name, semester FROM subjects ORDER BY semester;

-- Verify foreign key constraints
SHOW CREATE TABLE faculty_subject_assignments;
```

---

## Testing the API

### Option 1: Using curl (Command Line)

```bash
REM Get your JWT token first (login endpoint)
REM Then test subject endpoints

REM Get all subjects
curl -X GET "http://localhost:5000/api/v1/department-admin/subjects" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

REM Create a subject
curl -X POST "http://localhost:5000/api/v1/department-admin/subjects" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "code": "CS201",
  "name": "Advanced Programming",
  "semester": 3,
  "credits": 4,
  "type": "Theory+Practical",
  "is_elective": 0
}
EOF
```

### Option 2: Using Postman

1. **GET /api/v1/department-admin/subjects**
   - Method: GET
   - URL: `http://localhost:5000/api/v1/department-admin/subjects`
   - Headers: `Authorization: Bearer {token}`
   - Expected: List of subjects

2. **POST /api/v1/department-admin/subjects**
   - Method: POST
   - URL: `http://localhost:5000/api/v1/department-admin/subjects`
   - Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
   - Body:
   ```json
   {
     "code": "CS301",
     "name": "Web Development",
     "semester": 3,
     "credits": 4,
     "type": "Theory+Practical"
   }
   ```

3. **GET /api/v1/department-admin/subjects/:id**
   - Method: GET
   - URL: `http://localhost:5000/api/v1/department-admin/subjects/1`

4. **PUT /api/v1/department-admin/subjects/:id**
   - Method: PUT
   - URL: `http://localhost:5000/api/v1/department-admin/subjects/1`
   - Body: Update only the fields you want to change

5. **DELETE /api/v1/department-admin/subjects/:id**
   - Method: DELETE
   - URL: `http://localhost:5000/api/v1/department-admin/subjects/1`

6. **POST /api/v1/department-admin/subjects/:id/assign-faculty**
   - Method: POST
   - URL: `http://localhost:5000/api/v1/department-admin/subjects/1/assign-faculty`
   - Body:
   ```json
   {
     "faculty_id": 5,
     "academic_year": "2024-2025",
     "semester": 3
   }
   ```

7. **GET /api/v1/department-admin/subjects/available-faculty**
   - Method: GET
   - URL: `http://localhost:5000/api/v1/department-admin/subjects/available-faculty?subject_id=1&academic_year=2024-2025`

### Option 3: Using Node.js/JavaScript

```javascript
// Test in browser console or node.js
const token = 'YOUR_JWT_TOKEN';

// Get all subjects
fetch('http://localhost:5000/api/v1/department-admin/subjects', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));

// Create subject
fetch('http://localhost:5000/api/v1/department-admin/subjects', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    code: 'CS401',
    name: 'Machine Learning',
    semester: 4,
    credits: 4,
    type: 'Theory+Practical'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Database Queries

### Get Subjects by Department and Semester
```sql
SELECT code, name, credits, type, is_elective
FROM subjects
WHERE department_id = 1 AND semester = 3
ORDER BY code;
```

### Get Faculty Assignments for a Subject
```sql
SELECT 
  f.faculty_id,
  f.Name as faculty_name,
  fsa.academic_year,
  fsa.semester,
  fsa.status
FROM faculty_subject_assignments fsa
JOIN users f ON fsa.faculty_id = f.id
WHERE fsa.subject_id = 1
ORDER BY fsa.academic_year DESC;
```

### Get Subjects Taught by a Faculty
```sql
SELECT 
  s.code,
  s.name,
  fsa.academic_year,
  fsa.status
FROM faculty_subject_assignments fsa
JOIN subjects s ON fsa.subject_id = s.id
WHERE fsa.faculty_id = 5 AND fsa.status = 'active'
ORDER BY fsa.academic_year DESC;
```

### Find Subjects Without Faculty Assignment
```sql
SELECT 
  s.id,
  s.code,
  s.name,
  COUNT(fsa.faculty_id) as faculty_count
FROM subjects s
LEFT JOIN faculty_subject_assignments fsa ON s.id = fsa.subject_id AND fsa.status = 'active'
WHERE s.status = 'active'
GROUP BY s.id
HAVING faculty_count = 0
ORDER BY s.semester;
```

### Get Total Subjects per Semester
```sql
SELECT 
  semester,
  COUNT(*) as subject_count,
  SUM(credits) as total_credits
FROM subjects
WHERE status = 'active'
GROUP BY semester
ORDER BY semester;
```

---

## Server Management

### Start Backend Server
```bash
cd c:\Users\thanu\Documents\Projects\Eduvertex

# Install dependencies (first time only)
npm install

# Start server
npm start

# Expected output:
# Server running on port 5000
# Database connected
```

### Stop Backend Server
```bash
# Press Ctrl+C in terminal
# Or kill the process:
taskkill /PID {pid} /F
```

### Check if Server is Running
```bash
# Test endpoint
curl http://localhost:5000/api/v1/health

# Or in browser
# http://localhost:5000/api/v1/health
```

### View Server Logs
```javascript
// Logs will show:
// - Connection status
// - Request handling
// - Errors and warnings
// - Database query timing
```

---

## Frontend Testing

### Navigate to Subjects Page
```
1. Open browser: http://localhost:3000
2. Login as Department Admin
3. Go to Dashboard → Department Admin
4. Click "Subjects" in sidebar
5. Click "Add New Subject" button
```

### Create Test Subject via UI
```
Form Fields to Fill:
- Subject Code: CS501
- Subject Name: Advanced Web Development  
- Semester: 5
- Credits: 4
- Type: Theory+Practical
- Description: (optional)
- Click "Save" button
```

### Assign Faculty via UI
```
1. Find the subject you created
2. Click "Assign Faculty" button
3. Select faculty member from dropdown
4. Enter Academic Year: 2024-2025
5. Select Semester: 5
6. Click "Assign" button
7. Verify faculty now appears in "Assigned Faculty" section
```

---

## Troubleshooting Commands

### Check MySQL Connection
```bash
# Test connection
mysql -u root -p -h localhost -e "SELECT 1"

# If error, verify:
# 1. MySQL is running (services)
# 2. Username/password correct
# 3. Host is accessible
```

### Reset Sample Data
```sql
-- DELETE all sample data (if needed)
DELETE FROM faculty_subject_assignments;
DELETE FROM subject_class_mappings;
DELETE FROM subjects;

-- Reset auto-increment
ALTER TABLE subjects AUTO_INCREMENT = 1;
ALTER TABLE faculty_subject_assignments AUTO_INCREMENT = 1;
ALTER TABLE subject_class_mappings AUTO_INCREMENT = 1;

-- Re-insert sample data (from migration file)
-- Or manually insert new test data
```

### Check Model Associations
```javascript
// In Node.js console
import initModels from './models/index.js';
const models = initModels();

// Verify Subject model
console.log(models.Subject.associations);
// Should include: department, class, creator, assignedFaculty, classMappings

// Verify all models loaded
console.log(Object.keys(models));
```

### Monitor Query Performance
```sql
-- Enable query timing
SET SESSION sql_mode='TRADITIONAL';
SET SESSION long_query_time = 0;

-- Run a query and check execution time
SELECT code, name FROM subjects LIMIT 100;

-- Check if indexes are being used
EXPLAIN SELECT code, name FROM subjects WHERE department_id = 1;
-- Should show index_name in output
```

---

## Common Issues & Quick Fixes

### Issue: "Access denied for user 'root'@'localhost'"
```bash
# Solution: Check password
mysql -u root -p  -- Enter password carefully

# If forgotten, reset MySQL password:
# 1. Stop MySQL service
# 2. Start with: mysqld --skip-grant-tables
# 3. Connect and reset password
```

### Issue: "Table already exists"
```bash
# Solution: Drop and recreate
mysql -u root -p eduvertex -e "DROP TABLE subject_class_mappings;"
mysql -u root -p eduvertex -e "DROP TABLE faculty_subject_assignments;"
mysql -u root -p eduvertex -e "DROP TABLE subjects;"

# Then re-run migration
mysql -u root -p eduvertex < backend/migrations/001_create_subjects_table.sql
```

### Issue: "Unknown table 'subjects'"
```bash
# Solution: Migration didn't run properly
# Check migration file exists:
ls -la backend/migrations/001_create_subjects_table.sql

# Verify current tables:
mysql -u root -p eduvertex -e "SHOW TABLES;"
```

### Issue: API returns 404 for subject endpoints
```bash
# Solution: Server needs restart
# 1. Stop Node.js (Ctrl+C)
# 2. Restart: npm start
# 3. Test in browser: http://localhost:5000/api/v1/department-admin/subjects
```

### Issue: "Foreign key constraint fails"
```bash
# Solution: Check FK references
mysql -u root -p eduvertex -e "SELECT * FROM subjects WHERE id = {id};"

# If record doesn't exist, find what's referencing it:
mysql -u root -p eduvertex -e "SELECT * FROM timetable_slots WHERE subject_id = {id};"

# Delete orphaned references or ensure subject exists
```

---

## Performance Check

### Query Speed Test
```sql
-- Time a simple query
SELECT COUNT(*) FROM subjects;
-- Should return instantly (< 1ms)

-- Time a join query
SELECT s.code, COUNT(fsa.faculty_id) as faculty_count
FROM subjects s
LEFT JOIN faculty_subject_assignments fsa ON s.id = fsa.subject_id
GROUP BY s.id;
-- Should return in < 10ms

-- If slower, rebuild indexes:
ANALYZE TABLE subjects;
ANALYZE TABLE faculty_subject_assignments;
ANALYZE TABLE subject_class_mappings;
```

---

## Useful Links & Resources

- **API Documentation:** See `SUBJECT_MANAGEMENT_SCHEMA.md`
- **Implementation Steps:** See `IMPLEMENTATION_GUIDE.md`
- **Complete Summary:** See `SUBJECT_MANAGEMENT_COMPLETE_SUMMARY.md`
- **Migration File:** `backend/migrations/001_create_subjects_table.sql`
- **Rollback Script:** `backend/migrations/rollback_001_subjects.sql`

---

## File Locations Quick Reference

```
c:\Users\thanu\Documents\Projects\Eduvertex\
├── backend\
│   ├── migrations\
│   │   ├── 001_create_subjects_table.sql ← RUN THIS FIRST
│   │   └── rollback_001_subjects.sql
│   ├── models\
│   │   ├── Subject.model.js (UPDATED)
│   │   ├── SubjectClassMapping.model.js (NEW)
│   │   ├── FacultySubjectAssignment.model.js
│   │   └── index.js (UPDATED)
│   ├── controllers\
│   │   └── department-admin\
│   │       └── subject.controller.js (READY)
│   ├── routes\
│   │   └── department-admin\
│   │       └── subject.routes.js (REGISTERED)
│   └── server.js
├── frontend\
│   └── src\pages\admin\department-admin\pages\
│       └── SubjectManagement.tsx (READY)
└── Documentation files
    ├── SUBJECT_MANAGEMENT_SCHEMA.md
    ├── IMPLEMENTATION_GUIDE.md
    └── SUBJECT_MANAGEMENT_COMPLETE_SUMMARY.md
```

---

**You're all set! Follow the steps above to deploy the Subject Management System.** ✅

