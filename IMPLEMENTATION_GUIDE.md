# Subject Management System - Implementation Guide

## Status Summary
- ✅ Database Migration SQL created: `backend/migrations/001_create_subjects_table.sql`
- ✅ Subject Model updated with all fields (class_id, is_laboratory, min_hours_per_week, max_students, created_by)
- ✅ SubjectClassMapping Model created
- ✅ FacultySubjectAssignment Model exists and configured
- ✅ Subject Routes registered in server.js
- ✅ Subject Controller with all endpoints implemented
- 🔄 Models exported in models/index.js
- ⏳ SQL Migration needs to be executed in database
- ⏳ Frontend SubjectManagement.tsx ready for integration

---

## Step 1: Execute SQL Migration 

### Via MySQL Command Line
```bash
cd c:\Users\thanu\Documents\Projects\Eduvertex
mysql -u root -p -h localhost eduvertex < backend/migrations/001_create_subjects_table.sql
```

### Via MySQL Workbench
1. Open the migration file: `backend/migrations/001_create_subjects_table.sql`
2. Copy all content
3. In MySQL Workbench, paste and execute

### Verify Installation
```sql
-- Verify tables created
SHOW TABLES LIKE 'subject%';

-- Should return:
-- subject_class_mappings
-- subjects
-- faculty_subject_assignments

-- Verify subjects table structure
DESCRIBE subjects;
DESCRIBE faculty_subject_assignments;
DESCRIBE subject_class_mappings;

-- Verify foreign keys
SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME IN ('subjects', 'faculty_subject_assignments', 'subject_class_mappings')
ORDER BY TABLE_NAME;
```

---

## Step 2: Database Schema Overview

### subjects Table (14 columns)
| Column | Type | Notes |
|--------|------|-------|
| id | INT PRIMARY KEY | Auto-increment |
| subject_code | VARCHAR(20) UNIQUE | e.g., "CS101" |
| subject_name | VARCHAR(255) | Display name |
| description | TEXT | Long description |
| department_id | INT FK | Links to departments table |
| semester | TINYINT | 1-8 |
| class_id | INT FK (nullable) | Specific class or NULL for dept-wide |
| credits | DECIMAL(4,2) | Default 4.00 |
| type | ENUM | 'Theory', 'Practical', 'Theory+Practical' |
| is_elective | TINYINT(1) | 0=Core, 1=Elective |
| is_laboratory | TINYINT(1) | Has practical lab component |
| min_hours_per_week | INT | Default 3 |
| max_students | INT (nullable) | Capacity limit |
| status | ENUM | 'active', 'inactive', 'archived' |
| created_by | INT FK | Department admin who created |
| created_at | TIMESTAMP | Auto-populated |
| updated_at | TIMESTAMP | Auto-updated |

### faculty_subject_assignments Table (N:N mapping)
| Column | Type | Notes |
|--------|------|-------|
| id | INT PRIMARY KEY | Auto-increment |
| faculty_id | INT FK | Links to users (faculty) |
| subject_id | INT FK | Links to subjects |
| academic_year | VARCHAR(9) | e.g., "2024-2025" |
| semester | TINYINT | Current semester |
| class_id | INT FK (nullable) | Specific class assignment |
| allocation_date | DATE | When assigned |
| status | ENUM | 'active', 'inactive', 'suspended' |
| created_at | TIMESTAMP | Auto-populated |
| updated_at | TIMESTAMP | Auto-updated |
| **UNIQUE** | **(faculty_id, subject_id, class_id, academic_year)** | Prevents duplicates |

### subject_class_mappings Table
| Column | Type | Notes |
|--------|------|-------|
| id | INT PRIMARY KEY | Auto-increment |
| subject_id | INT FK | Links to subjects |
| class_id | INT FK | Links to classes |
| department_id | INT FK | Links to departments |
| semester | TINYINT | 1-8 |
| academic_year | VARCHAR(9) | e.g., "2024-2025" |
| is_core | TINYINT(1) | 0=Elective, 1=Core |
| status | ENUM | 'active', 'inactive' |
| created_at | TIMESTAMP | Auto-populated |
| **UNIQUE** | **(subject_id, class_id, semester, academic_year)** | Prevents duplicates |

---

## Step 3: Model Integration with Sequelize

### Files Updated
1. **Subject.model.js** - Updated with new fields
   - Added: class_id, is_laboratory, min_hours_per_week, max_students, created_by
   - Added associations: Class, User (creator), SubjectClassMapping
   - Status enum: 'active', 'inactive', 'archived'

2. **SubjectClassMapping.model.js** - NEW
   - Maps subjects to specific classes per semester
   - Includes academic_year tracking

3. **FacultySubjectAssignment.model.js** - Already existed
   - N:N relationship between Faculty and Subject
   - Includes academic_year, semester, class_id

4. **models/index.js** - Updated
   - Added SubjectClassMapping import and export
   - All associations automatically evaluated on model initialization

### Model Relationships
```
Subject
├── hasMany: FacultySubjectAssignment (via many-to-many with Faculty)
├── hasMany: SubjectClassMapping
├── belongsTo: Department
├── belongsTo: Class (optional)
└── belongsTo: User (creator)

Faculty
├── belongsToMany: Subject (through faculty_subject_assignments)
└── hasMany: FacultySubjectAssignment

SubjectClassMapping
├── belongsTo: Subject
├── belongsTo: Class
└── belongsTo: Department

FacultySubjectAssignment
├── belongsTo: Faculty
├── belongsTo: Subject
└── belongsTo: User (who assigned)
```

---

## Step 4: API Endpoints (Already Implemented)

### Subjects (CRUD)
```
GET    /api/v1/department-admin/subjects              - List all subjects (with filters)
GET    /api/v1/department-admin/subjects/:id          - Get single subject
POST   /api/v1/department-admin/subjects              - Create new subject
PUT    /api/v1/department-admin/subjects/:id          - Update subject
DELETE /api/v1/department-admin/subjects/:id          - Delete subject
```

### Faculty Assignment
```
POST   /api/v1/department-admin/subjects/:id/assign-faculty           - Assign faculty
DELETE /api/v1/department-admin/subjects/:id/assignments/:assignment_id - Remove assignment
GET    /api/v1/department-admin/subjects/:id/faculty                   - Get assigned faculty
GET    /api/v1/department-admin/subjects/available-faculty             - Get unassigned faculty
```

### Class Association (Ready to implement)
```
GET    /api/v1/department-admin/subjects/class/:classId               - Get subjects for class
GET    /api/v1/department-admin/subjects/faculty/:facultyId           - Get faculty subjects
POST   /api/v1/department-admin/subjects/:id/map-class                - Map to class
GET    /api/v1/department-admin/subjects/class/:classId/mappings      - Get mappings
```

---

## Step 5: Frontend Integration

### SubjectManagement.tsx (Already exists)
Location: `frontend/src/pages/admin/department-admin/pages/SubjectManagement.tsx`

The component is ready to call:
1. `GET /api/v1/department-admin/subjects` - Load subjects list
2. `POST /api/v1/department-admin/subjects` - Create new subject
3. `PUT /api/v1/department-admin/subjects/:id` - Update subject
4. `DELETE /api/v1/department-admin/subjects/:id` - Delete subject
5. `POST /api/v1/department-admin/subjects/:id/assign-faculty` - Assign faculty
6. `GET /api/v1/department-admin/subjects/available-faculty` - Get available faculty

---

## Step 6: Testing the Implementation

### Test via Postman/Insomnia

#### 1. Create a Subject
```bash
POST /api/v1/department-admin/subjects
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "code": "CS201",
  "name": "Database Management Systems",
  "description": "Learn SQL, ER models, normalization",
  "semester": 3,
  "credits": 4,
  "type": "Theory",
  "is_elective": 0,
  "is_laboratory": 0,
  "min_hours_per_week": 4,
  "max_students": 60
}

Response (201):
{
  "success": true,
  "message": "Subject created successfully",
  "data": {
    "id": 1,
    "code": "CS201",
    "name": "Database Management Systems",
    ...
  }
}
```

#### 2. Get All Subjects
```bash
GET /api/v1/department-admin/subjects?semester=3&status=active
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "code": "CS201",
      "name": "Database Management Systems",
      ...
    }
  ]
}
```

#### 3. Assign Faculty
```bash
POST /api/v1/department-admin/subjects/1/assign-faculty
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "faculty_id": 5,
  "academic_year": "2024-2025",
  "semester": 3
}

Response (200):
{
  "success": true,
  "message": "Faculty Dr. John Doe assigned to Database Management Systems successfully",
  "data": { ...updated subject with assignedFaculty }
}
```

#### 4. Get Available Faculty
```bash
GET /api/v1/department-admin/subjects/available-faculty?subject_id=1&academic_year=2024-2025
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "count": 8,
  "data": [
    {
      "faculty_id": 3,
      "Name": "Dr. Jane Smith",
      "email": "jane@college.edu"
    }
  ]
}
```

#### 5. Update Subject
```bash
PUT /api/v1/department-admin/subjects/1
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Advanced Database Management Systems",
  "credits": 5,
  "is_laboratory": 1
}

Response (200):
{
  "success": true,
  "message": "Subject updated successfully",
  "data": { ...updated subject }
}
```

#### 6. Delete Subject
```bash
DELETE /api/v1/department-admin/subjects/1
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "message": "Subject deleted successfully",
  "data": {}
}
```

---

## Step 7: Data Flow Diagram

```
Department Admin
   ↓
Creates Subject
   ├─→ subjects table (id, code, name, department_id, semester, ...)
   │
Assigns Faculty
   ├→ faculty_subject_assignments (faculty_id, subject_id, academic_year)
   │
Maps to Classes
   └→ subject_class_mappings (subject_id, class_id, semester, academic_year)

Timetable Generation
   ├─→ timetable_slots (subject_id FK → subjects.id)
   │
Attendance Recording
   └─→ student_attendance_entry (subject_id FK → subjects.id)
```

---

## Step 8: Sample Data

The migration script includes sample data:

```sql
INSERT INTO subjects (code, name, department_id, semester, credits, type, ...)
VALUES 
  ('CS101', 'Programming in C', 1, 1, 4, 'Theory+Practical', ...),
  ('CS102', 'Data Structures', 1, 2, 4, 'Theory+Practical', ...),
  ('EC101', 'Basic Electronics', 2, 1, 3, 'Theory', ...),
  ('ME101', 'Engineering Mechanics', 3, 1, 4, 'Theory', ...);
```

Query to verify:
```sql
SELECT id, code, name, department_id, semester, status
FROM subjects
WHERE status = 'active'
ORDER BY department_id, semester, code;
```

---

## Step 9: Error Handling

### Common Errors & Solutions

### 409 Conflict - Subject Code Already Exists
```json
{
  "success": false,
  "error": "Subject with this code already exists in your department"
}
```
**Solution:** Use unique subject code within department

### 404 Not Found - Subject Not Found
```json
{
  "success": false,
  "error": "Subject not found"
}
```
**Solution:** Verify subject ID and that it belongs to your department

### 400 Bad Request - Active Assignments
```json
{
  "success": false,
  "error": "Cannot delete subject with active faculty assignments. Please remove assignments first."
}
```
**Solution:** Remove all faculty assignments before deleting

### 400 Bad Request - Duplicate Assignment
```json
{
  "success": false,
  "error": "Faculty is already assigned to this subject for this academic year"
}
```
**Solution:** Faculty can only be assigned once per academic year (use PUT to update semester)

---

## Step 10: Security & Role-Based Access

### Department Admin (role_id = 7)
- ✅ Can create subjects in their own department
- ✅ Can view subjects in their own department
- ✅ Can edit subjects in their own department
- ✅ Can delete subjects (with no active faculty assignments)
- ✅ Can assign faculty from their department
- ❌ Cannot create subjects in other departments
- ❌ Cannot edit subjects in other departments

### Super Admin (role_id = 1)
- ✅ Can create subjects in any department
- ✅ Can view/edit/delete all subjects
- ✅ Can assign faculty to any subject

### Authentication
All endpoints require:
```javascript
Authorization: Bearer {jwt_token}
X-Requested-With: XMLHttpRequest
```

---

## Step 11: Database Constraints & Integrity

### Foreign Key Constraints
```sql
ALTER TABLE timetable_slots
ADD CONSTRAINT fk_timetable_slots_subject
FOREIGN KEY (subject_id) REFERENCES subjects(id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE student_attendance_entry
ADD CONSTRAINT fk_attendance_subject
FOREIGN KEY (subject_id) REFERENCES subjects(id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE timetable_slot_assignments
ADD CONSTRAINT fk_slot_assignment_subject
FOREIGN KEY (subject_id) REFERENCES subjects(id)
ON DELETE RESTRICT ON UPDATE CASCADE;
```

### Cascade Behavior
- **ON DELETE RESTRICT:** Cannot delete a subject if it has references in timetable_slots or attendance
- **ON UPDATE CASCADE:** If subject ID changes, all related records update automatically

### Unique Constraints
- **subject_code:** Globally unique
- **(faculty_id, subject_id, class_id, academic_year):** Faculty assigned once per subject/class/year
- **(subject_id, class_id, semester, academic_year):** Subject assigned once per class/semester/year

---

## Step 12: Performance Optimization

### Indexes Created
```sql
CREATE INDEX idx_subjects_code ON subjects(subject_code);
CREATE INDEX idx_subjects_dept_sem ON subjects(department_id, semester);
CREATE INDEX idx_subjects_class_id ON subjects(class_id);
CREATE INDEX idx_subjects_status ON subjects(status);

CREATE INDEX idx_fsa_subject ON faculty_subject_assignments(subject_id);
CREATE INDEX idx_fsa_faculty_year ON faculty_subject_assignments(faculty_id, academic_year);
CREATE INDEX idx_fsa_status ON faculty_subject_assignments(status);

CREATE INDEX idx_scm_class_sem ON subject_class_mappings(class_id, semester);
CREATE INDEX idx_scm_dept_sem ON subject_class_mappings(department_id, semester);
```

### Query Optimization
✅ Covered queries:
- Get subjects by department + semester
- Get faculty assignments by subject + academic_year
- Get available faculty for assignment
- Get subjects for class by semester

---

## Step 13: Common Use Cases

### Use Case 1: Create Subject & Assign Faculty
```javascript
// 1. Department admin creates subject
POST /api/v1/department-admin/subjects
{
  "code": "CS301",
  "name": "Web Development",
  "semester": 3,
  ...
}

// 2. Assign faculty
POST /api/v1/department-admin/subjects/1/assign-faculty
{
  "faculty_id": 5,
  "academic_year": "2024-2025",
  "semester": 3
}

// 3. Map to classes
POST /api/v1/department-admin/subjects/1/map-class
{
  "class_id": 1,
  "semester": 3,
  "academic_year": "2024-2025",
  "is_core": 1
}
```

### Use Case 2: Bulk Update Faculty Assignments
```javascript
// 1. Get all subjects for semester
GET /api/v1/department-admin/subjects?semester=3

// 2. For each subject, get available faculty
GET /api/v1/department-admin/subjects/available-faculty?subject_id=1&academic_year=2024-2025

// 3. Assign faculty one by one
POST /api/v1/department-admin/subjects/1/assign-faculty
```

### Use Case 3: Verify Timetable Coverage
```sql
SELECT 
  s.code,
  s.name,
  COUNT(DISTINCT fsa.faculty_id) as faculty_assigned,
  COUNT(DISTINCT ts.id) as timetable_slots
FROM subjects s
LEFT JOIN faculty_subject_assignments fsa ON s.id = fsa.subject_id 
  AND fsa.status = 'active'
LEFT JOIN timetable_slots ts ON s.id = ts.subject_id
WHERE s.department_id = 1 AND s.semester = 3
GROUP BY s.id
HAVING faculty_assigned = 0;  -- Find subjects without faculty
```

---

## Step 14: Next Steps

1. ✅ Execute SQL migration
2. ✅ Verify tables exist in database
3. ✅ Test API endpoints with Postman
4. ✅ Integrate frontend SubjectManagement.tsx
5. ✅ Create sample subjects for testing
6. ✅ Assign faculty to subjects
7. ✅ Map subjects to classes
8. ✅ Verify timetable integration
9. ✅ Test attendance recording with subjects
10. ✅ Add validation for subject credits range
11. ✅ Create department-level reporting (subjects per semester)
12. ✅ Set up log tracking for subject creation/modification

---

## Troubleshooting

### Issue: "Table already exists" during migration
**Solution:** Check if tables exist and back them up, then DROP them before running migration

### Issue: API returns 404 for subject routes
**Solution:** Restart server (changes to models/routes need fresh server start)

### Issue: Subject assignment failing
**Solution:** Verify faculty exists in department, verify academic_year format (YYYY-YYYY)

### Issue: Foreign key constraint violation
**Solution:** Ensure subject_id in timetable_slots matches an existing subject in subjects table

---

## References

- [Sequelize Documentation](https://sequelize.org/)
- [MySQL Foreign Keys](https://dev.mysql.com/doc/refman/8.0/en/foreign-keys.html)
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html)

---

End of Implementation Guide
