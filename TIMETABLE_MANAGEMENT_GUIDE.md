# Timetable Management System - Implementation Guide

## Overview
A comprehensive timetable management system with the following features:
- 7 periods per day with break timings
- Different break timings for 1st, 2nd, 3rd, 4th year students
- Staff alteration with alternative faculty notification
- Bulk upload functionality
- Individual faculty timetable view
- Class/Student timetable view
- Leave management integration

## Database Structure

### New Tables Created

1. **timetable_master**
   - Main timetable record
   - Status: draft, pending_approval, active, inactive
   - Tracks timetable incharge and approval information

2. **timetable_details**
   - Individual period details (7 periods per day)
   - Links to class, subject, and faculty
   - Day of week and period number
   - Period type: lecture, practical, tutorial, break, lunch

3. **period_config**
   - Global or department-specific period timing configuration
   - 7 periods defined for each system
   - Break information embedded

4. **faculty_leave_schedules**
   - Faculty unavailability tracking
   - Linked to faculty_leaves table
   - Active date ranges

5. **timetable_staff_alterations**
   - Request for staff changes (when staff on leave)
   - Sends notification to alternative faculty
   - Status: pending, accepted, rejected
   - Tracks acceptance time and response

6. **year_break_timings**
   - Break timings per year level (1st, 2nd, 3rd, 4th)
   - Different breaks for different year cohorts
   - Department-specific or global configuration

## API Endpoints

### Timetable Management
- `GET /api/v1/timetable-management` - Get all timetables with filters
- `GET /api/v1/timetable-management/:id` - Get single timetable with details
- `POST /api/v1/timetable-management` - Create new timetable
- `POST /api/v1/timetable-management/bulk-upload` - Bulk upload periods

### Faculty Views
- `GET /api/v1/timetable-management/faculty/:faculty_id` - Get faculty's personal timetable
- Includes leave information
- Warns if faculty is on leave

### Student Views
- `GET /api/v1/timetable-management/class/:class_id/timetable/:timetable_id` - Get class timetable
- Includes break timings for the year
- Shows all faculty assignments

### Staff Alteration
- `POST /api/v1/timetable-management/staff-alterations` - Request staff change
- `GET /api/v1/timetable-management/staff-alterations/pending` - Get pending requests
- `PUT /api/v1/timetable-management/staff-alterations/:id/accept` - Accept alteration
- `PUT /api/v1/timetable-management/staff-alterations/:id/reject` - Reject alteration

### Period Configuration
- `GET /api/v1/timetable-management/periods/:department_id` - Get period config
- `POST /api/v1/timetable-management/periods` - Create/update periods

## Setup Instructions

### 1. Initialize Database
Run migrations to create tables:
```bash
npm run migrate
```

### 2. Initialize Period Configuration
Run the initialization script:
```bash
node initializePeriodConfig.js
```

This creates:
- 7 periods per day (09:00 - 14:20)
- Break timings for 1st & 2nd year students
- Break timings for 3rd & 4th year students

### 3. Timetable Creation Workflow

#### Step 1: Create Timetable Master
- Create a new timetable with department, academic year, semester
- Status starts as "draft"

#### Step 2: Add Periods
Option A - Manual Entry
- Open timetable and add periods individually
- Select class, subject, faculty for each period

Option B - Bulk Upload
- Prepare CSV file with format:
  ```
  class_id,day_of_week,period_number,subject_id,faculty_id,room_number,period_type,is_break
  1,Monday,1,101,1,101A,lecture,false
  1,Monday,2,101,1,101A,lecture,false
  1,Monday,3,,,,break,true
  ```
- Upload via bulk upload endpoint

### 4. View Timetables

#### For Faculty
- Faculty logs in
- Views own timetable
- System checks for active leaves
- Shows warning if on leave
- Can download timetable

#### For Students
- Access class timetable
- View all faculty assignments
- See break timings for their year
- Download timetable with break info

#### For Administrators
- View all timetables
- Filter by department, year, semester, status
- Edit/modify timetables
- Approve pending timetables

## Staff Alteration Workflow

### When Staff is on Leave:

1. **Request Alteration**
   - Admin requests staff change
   - Specifies reason (e.g., "Faculty on medical leave")
   - Selects alternative faculty
   - System creates notification

2. **Alternative Faculty Receives Notification**
   - Pending alteration shows in their notifications
   - Views request details
   - Can accept or reject

3. **If Accepted**
   - Staff change is applied
   - Timetable updated
   - Original faculty notified
   - Period assigned to alternative faculty

4. **If Rejected**
   - Rejection reason recorded
   - Admin notified
   - Timetable unchanged
   - Another alternative must be found

## Period Configuration

### 7 Periods Per Day
- **Period 1**: 09:00 - 09:50 (50 min)
- **Period 2**: 09:50 - 10:40 (50 min)
- **Break**: 10:40 - 11:10 (30 min)
- **Period 3**: 11:10 - 12:00 (50 min)
- **Period 4**: 12:00 - 12:50 (50 min)
- **Lunch**: 12:50 - 01:30 (40 min)
- **Period 5**: 01:30 - 02:20 (50 min)

### Break Timings by Year

**1st & 2nd Year:**
- Tea Break: 10:40 - 11:10
- Lunch: 12:50 - 01:30

**3rd & 4th Year:**
- Tea Break: 10:40 - 11:00 (20 min)
- Lunch: 12:50 - 01:20 (30 min)

Note: Different break timings allow for better resource management and different scheduling preferences.

## CSV Upload Format

### Required Columns
- `class_id` - Class identifier
- `day_of_week` - Monday through Saturday
- `period_number` - 1 to 7
- `subject_id` (optional) - Subject ID
- `faculty_id` (optional) - Faculty ID
- `room_number` (optional) - Room/Lab number
- `period_type` (optional) - lecture, practical, tutorial, break, lunch
- `is_break` (optional) - true/false

### Example CSV
```csv
class_id,day_of_week,period_number,subject_id,faculty_id,room_number,period_type,is_break
1,Monday,1,101,1,101,lecture,false
1,Monday,2,102,2,101,lecture,false
1,Monday,3,,,,,true
1,Monday,4,103,3,103,practical,false
```

## Frontend Components

### TimetableManagement.tsx
- Main admin interface
- Create, view, edit timetables
- Bulk upload interface
- Pending alterations alert

### FacultyTimetable.tsx
- Faculty personal timetable view
- Leave status display
- Download timetable
- Share functionality

### ClassTimetable.tsx
- Student class timetable view
- Break timing display (based on year)
- Faculty information
- Room assignments

## Features Implemented

✅ **7 Periods Per Day**
- Configurable timing
- Break periods included
- Global or department-specific

✅ **Different Break Timings**
- 1st & 2nd year: 30 min tea, 40 min lunch
- 3rd & 4th year: 20 min tea, 30 min lunch
- Auto-applied based on class year

✅ **Staff Alteration System**
- Request when staff unavailable
- Notify alternative faculty
- Accept/reject workflow
- Automatic period reassignment

✅ **Leave Integration**
- Check faculty leave schedule
- Display leave status
- Trigger alteration when on leave

✅ **Bulk Upload**
- CSV import for periods
- Error reporting per row
- Partial success handling

✅ **Multiple Views**
- Admin: Manage all timetables
- Faculty: Personal timetable
- Student: Class timetable

## Future Enhancements

1. **Conflict Detection**
   - Prevent double-booking of faculty
   - Prevent room conflicts
   - Alert on overlapping periods

2. **Email Notifications**
   - Email faculty for alterations
   - Calendar integration
   - ICS file generation

3. **Advanced Analytics**
   - Faculty workload balancing
   - Room utilization reports
   - Clash detection reports

4. **Mobile App**
   - Mobile-optimized timetable view
   - Push notifications
   - Offline access

5. **Approval Workflow**
   - Admissions approval chain
   - HOD approval
   - Principal sign-off

## Testing Endpoints

### Create Period Config
```bash
POST /api/v1/timetable-management/periods
{
  "department_id": null,
  "periods": [
    {
      "period_number": 1,
      "start_time": "09:00",
      "end_time": "09:50",
      "duration_minutes": 50,
      "is_break": false
    }
  ]
}
```

### Create Timetable
```bash
POST /api/v1/timetable-management
{
  "name": "CSE A - Semester 6 - Odd 2024",
  "academic_year": "2024-2025",
  "semester": "odd",
  "department_id": 1,
  "year": "3rd"
}
```

### Get Faculty Timetable
```bash
GET /api/v1/timetable-management/faculty/1?academic_year=2024-2025&semester=odd
```

### Request Staff Alteration
```bash
POST /api/v1/timetable-management/staff-alterations
{
  "timetable_id": 1,
  "timetable_detail_id": 5,
  "original_faculty_id": 1,
  "alternative_faculty_id": 2,
  "reason": "Faculty on medical leave"
}
```

## Troubleshooting

### Period Configuration Not Loading
- Run initialization script again
- Check department_id is correct
- Verify database connection

### Timetable Details Not Showing
- Ensure periods are created
- Check class exists
- Verify subject and faculty are assigned

### Staff Alteration Not Sending
- Implement notification service
- Check alternative faculty email
- Verify request status is pending
