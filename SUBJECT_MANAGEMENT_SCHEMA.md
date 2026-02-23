# Subject Management System - Database & API Documentation

## Overview
The Subject Management System allows Department Admins to create, manage, and assign subjects to classes and faculties. This connects with timetable, attendance, and marks management systems.

---

## 1. DATABASE SCHEMA

### 1.1 Subjects Table
Stores all subject information for the college.

```sql
CREATE TABLE subjects (
  id                  INT PRIMARY KEY AUTO_INCREMENT,
  subject_code        VARCHAR(20) UNIQUE NOT NULL,        -- e.g., "CS101"
  subject_name        VARCHAR(255) NOT NULL,             -- e.g., "Data Structures"
  description         TEXT,                              -- Detailed subject description
  department_id       INT NOT NULL FK→departments.id,    -- Department offering subject
  semester            TINYINT NOT NULL,                  -- 1-8 semesters
  class_id            INT FK→classes.id (nullable),      -- Specific class or NULL for all in dept
  credits             DECIMAL(4,2) DEFAULT 4.00,         -- Credit hours
  type                ENUM('Theory','Practical','Theory+Practical','Project','Seminar','Internship'),
  is_elective         TINYINT(1) DEFAULT 0,              -- 0=Core, 1=Elective
  is_laboratory       TINYINT(1) DEFAULT 0,              -- Has practical lab component
  min_hours_per_week  INT DEFAULT 3,                     -- Minimum teaching hours/week
  max_students        INT (nullable),                    -- Capacity limit if any
  status              ENUM('active','inactive','archived') DEFAULT 'active',
  created_by          INT NOT NULL FK→users.id,          -- Department admin who created
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEXES: subject_code, department_id, semester, class_id, status
);
```

### 1.2 Faculty Subject Assignments Table
Many-to-many mapping of faculty members to subjects they teach.

```sql
CREATE TABLE faculty_subject_assignments (
  id                 INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id         INT NOT NULL FK→users.id,           -- Faculty member
  subject_id         INT NOT NULL FK→subjects.id,        -- Subject being taught
  academic_year      VARCHAR(9),                         -- e.g., "2024-2025"
  semester           TINYINT NOT NULL,                  -- Current semester
  class_id           INT FK→classes.id (nullable),       -- Specific class assignment
  allocation_date    DATE NOT NULL,                      -- When assignment started
  status             ENUM('active','inactive','suspended') DEFAULT 'active',
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY: (faculty_id, subject_id, class_id, academic_year),
  INDEXES: subject_id, class_id, academic_year, status
);
```

### 1.3 Subject Class Mappings Table
Associates subjects with specific classes for each semester/academic year.

```sql
CREATE TABLE subject_class_mappings (
  id                 INT PRIMARY KEY AUTO_INCREMENT,
  subject_id         INT NOT NULL FK→subjects.id,
  class_id           INT NOT NULL FK→classes.id,
  department_id      INT NOT NULL FK→departments.id,
  semester           TINYINT NOT NULL,
  academic_year      VARCHAR(9),                         -- e.g., "2024-2025"
  is_core            TINYINT(1) DEFAULT 1,               -- 0=Elective, 1=Core
  status             ENUM('active','inactive') DEFAULT 'active',
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY: (subject_id, class_id, semester, academic_year),
  INDEXES: class_id, semester, department_id
);
```

### 1.4 Foreign Key Relationships
All these tables are linked to existing tables:
- `timetable_slots.subject_id` → `subjects.id` (constraint added)
- `timetable_slot_assignments.subject_id` → `subjects.id` (constraint added)
- `student_attendance_entry.subject_id` → `subjects.id` (constraint added)
- `student_marks.subjectId` → `subjects.id` (constraint to be added)

---

## 2. API ENDPOINTS

### Base URL: `/api/v1/department-admin/subjects`

### 2.1 Subject Management

#### GET /subjects
Get all subjects with filters
```
Query Params:
  - department_id (number) - Filter by department
  - semester (number) - Filter by semester (1-8)
  - status (string) - active | inactive | archived
  - class_id (number) - Filter by specific class
  - is_elective (boolean) - Filter by elective/core
  - search (string) - Search by code or name

Response:
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": 1,
      "subject_code": "CS101",
      "subject_name": "Programming in C",
      "description": "...",
      "department_id": 1,
      "department_name": "CSE",
      "semester": 1,
      "class_id": 1,
      "class_name": "CSE A",
      "credits": 3.00,
      "type": "Theory",
      "is_elective": 0,
      "is_laboratory": 1,
      "min_hours_per_week": 3,
      "max_students": null,
      "status": "active",
      "created_by": 1,
      "created_by_name": "Admin Name",
      "created_at": "2024-01-15 10:30:00",
      "updated_at": "2024-01-15 10:30:00"
    }
  ]
}
```

#### GET /subjects/:id
Get single subject details
```
Response: Same structure as above, single object
```

#### POST /subjects
Create new subject
```
Body:
{
  "subject_code": "CS102",
  "subject_name": "Data Structures",
  "description": "Learn arrays, linked lists, stacks, queues",
  "semester": 2,
  "class_id": null,                    // Optional: specific class
  "credits": 4.00,                     // Optional: default 4
  "type": "Theory|Practical|Theory+Practical",
  "is_elective": 0,                    // Optional: default 0
  "is_laboratory": 0,                  // Optional: default 0
  "min_hours_per_week": 3,            // Optional: default 3
  "max_students": null                 // Optional
}

Response:
{
  "success": true,
  "message": "Subject created successfully",
  "data": { ...new subject }
}

Note: department_id is auto-populated for department-admin from their assigned department
```

#### PUT /subjects/:id
Update subject details
```
Body: Same as POST (except subject_code and department_id are immutable)

Response:
{
  "success": true,
  "message": "Subject updated successfully",
  "data": { ...updated subject }
}
```

#### DELETE /subjects/:id
Delete/archive subject
```
Response:
{
  "success": true,
  "message": "Subject deleted successfully"
}
```

---

### 2.2 Faculty Assignment

#### POST /subjects/:subjectId/assign-faculty
Assign faculty to teach a subject
```
Body:
{
  "faculty_id": 5,
  "academic_year": "2024-2025",
  "semester": 2,
  "class_id": 1                        // Optional: specific class
}

Response:
{
  "success": true,
  "message": "Faculty assigned to subject successfully",
  "data": {
    "id": 1,
    "faculty_id": 5,
    "subject_id": 2,
    "academic_year": "2024-2025",
    "semester": 2,
    "class_id": 1,
    "allocation_date": "2024-01-15",
    "status": "active"
  }
}
```

#### GET /subjects/:subjectId/faculty
Get all faculty assigned to subject
```
Query Params:
  - academic_year (string) - Optional filter

Response:
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "faculty_id": 5,
      "faculty_firstname": "John",
      "faculty_lastname": "Doe",
      "faculty_email": "john@college.edu",
      "subject_id": 2,
      "class_id": 1,
      "class_name": "CSE A",
      "academic_year": "2024-2025",
      "status": "active"
    }
  ]
}
```

#### DELETE /subjects/assignment/:assignmentId
Remove faculty assignment
```
Response:
{
  "success": true,
  "message": "Faculty assignment removed successfully"
}
```

---

### 2.3 Class Associations

#### GET /subjects/class/:classId
Get subjects for specific class
```
Query Params:
  - semester (number) - Optional filter

Response:
{
  "success": true,
  "count": 8,
  "data": [ ...subjects for that class ]
}
```

#### GET /subjects/faculty/:facultyId
Get subjects taught by faculty
```
Query Params:
  - academic_year (string) - Optional filter

Response:
{
  "success": true,
  "count": 5,
  "data": [ ...subjects taught by faculty ]
}
```

#### POST /subjects/:subjectId/map-class
Map subject to class
```
Body:
{
  "class_id": 1,
  "department_id": 1,
  "semester": 2,
  "academic_year": "2024-2025",
  "is_core": 1                         // 0 = elective, 1 = core
}

Response:
{
  "success": true,
  "message": "Subject mapped to class successfully",
  "data": { ...mapping }
}
```

#### GET /subjects/class/:classId/mappings
Get subject mappings for class
```
Query Params:
  - academic_year (string) - Optional filter

Response:
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": 1,
      "subject_id": 2,
      "subject_code": "CS102",
      "subject_name": "Data Structures",
      "class_id": 1,
      "semester": 2,
      "is_core": 1,
      "credits": 4.00,
      "type": "Theory"
    }
  ]
}
```

---

## 3. IMPLEMENTATION STEPS

### Frontend Setup (Already Done)
- ✅ SubjectManagement.tsx component created
- ✅ Department-admin page integrated with MainLayout
- API calls structure is ready

### Backend Setup (Steps to Complete)
1. Run migration SQL script:
   ```bash
   mysql -u user -p database_name < migrations/001_create_subjects_table.sql
   ```

2. Create/Update Subject routes in:
   ```javascript
   // File: routes/department-admin/subjects.routes.js
   const express = require('express');
   const subjectController = require('../../controllers/department-admin/subject.controller');
   const { protect, authorize } = require('../../middleware/auth');
   
   const router = express.Router();
   
   router.use(protect);
   router.use(authorize('department-admin'));
   
   // Subject CRUD
   router.get('/', subjectController.getAllSubjects);
   router.get('/:id', subjectController.getSubject);
   router.post('/', subjectController.createSubject);
   router.put('/:id', subjectController.updateSubject);
   router.delete('/:id', subjectController.deleteSubject);
   
   // Faculty Assignments
   router.post('/:subjectId/assign-faculty', subjectController.assignFacultyToSubject);
   router.delete('/assignment/:assignmentId', subjectController.removeFacultyAssignment);
   router.get('/:subjectId/faculty', subjectController.getFacultyForSubject);
   
   // Class Associations
   router.get('/class/:classId/subjects', subjectController.getSubjectsForClass);
   router.get('/faculty/:facultyId/subjects', subjectController.getSubjectsByFaculty);
   router.post('/:subjectId/map-class', subjectController.mapSubjectToClass);
   router.get('/class/:classId/mappings', subjectController.getSubjectMappingsForClass);
   
   module.exports = router;
   ```

3. Update server.js to include routes:
   ```javascript
   app.use('/api/v1/department-admin/subjects', require('./routes/department-admin/subjects.routes'));
   ```

---

## 4. SAMPLE DATA

Sample subjects have been inserted during migration for:
- CSE (Computer Science & Engineering) - Semester 1-2
- ECE (Electronics & Communication) - Semester 1
- MECH (Mechanical Engineering) - Semester 1-2

Modify/extend in migration file as needed.

---

## 5. KEY FEATURES

1. **Unique Subject Codes**: Each subject must have unique code per department
2. **Department Isolation**: Department admins only see/manage their own department subjects
3. **Flexible Mapping**: Subjects can be core or elective, and mapped to specific semesters/classes
4. **Faculty Assignment**: Track which faculty teaches which subject in which class/semester
5. **Audit Trail**: Track creation/modification with timestamps and creator info
6. **Status Management**: Subjects can be active, inactive, or archived
7. **Foreign Key Constraints**: Ensures data integrity with existing tables (timetables, attendance, marks)

---

## 6. SECURITY CONSIDERATIONS

- Department admins restricted to their department subjects
- Created_by tracks who created each subject
- Status field prevents hard deletes (cascade with care)
- All API endpoints require authentication with role-based access control

---

## 7. TESTING

### Create Subject
```bash
POST /api/v1/department-admin/subjects
{
  "subject_code": "CS201",
  "subject_name": "Database Management Systems",
  "description": "SQL, ER Models, Normalization",
  "semester": 3,
  "credits": 4.00,
  "type": "Theory",
  "is_elective": 0
}
```

### Assign Faculty
```bash
POST /api/v1/department-admin/subjects/1/assign-faculty
{
  "faculty_id": 5,
  "academic_year": "2024-2025",
  "semester": 3,
  "class_id": 1
}
```

### Get All Subjects (CSE Department)
```bash
GET /api/v1/department-admin/subjects?department_id=1&semester=1
```

---

## 8. INTEGRATION WITH EXISTING SYSTEMS

### Timetable
- When creating timetable slots, use `subject_id` from subjects table
- Pre-populate available subjects based on class/semester

### Attendance
- Faculty mark attendance by subject
- Link to `student_attendance_entry.subject_id`

### Student Marks
- Record marks per subject
- Link to `student_marks.subjectId`

### Faculty Management
- Faculty can view/manage subjects they're assigned to
- `/api/v1/faculty/subjects` endpoint for faculty view

---

End of Documentation
