import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import { sequelize, models } from '../../models/index.js';
// we'll need faculty model to validate department
const { Faculty } = models;
import { Op } from 'sequelize';
import csvParser from 'csv-parser';
import fs from 'fs';

const { TimetableSimple } = models;

// @desc      Bulk upload timetable from CSV
// @route     POST /api/v1/timetable/bulk-upload
// @access    Private
export const bulkUploadTimetable = asyncHandler(async (req, res, next) => {
  // Debug logging
  console.log('=== Bulk Upload Request ===');
  console.log('req.file:', req.file);
  console.log('req.body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Authorization:', req.headers.authorization ? 'Present' : 'Missing');
  console.log('User:', req.user);
  
  // Check if file was uploaded
  if (!req.file) {
    console.log('ERROR: No file uploaded');
    return next(new ErrorResponse('Please upload a CSV file', 400));
  }

  // Get academicYear and semester from request body (optional - can be in CSV)
  const { academicYear: bodyAcademicYear, semester } = req.body;

  // Parse CSV file - use let for results since we need to reassign
  let results = [];
  const errors = [];
  let csvHeaders = [];
  
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (data) => {
          // Log headers on first row
          if (csvHeaders.length === 0) {
            csvHeaders = Object.keys(data);
            console.log('[DEBUG] CSV Headers detected:', csvHeaders);
          }
          // Validate required fields
          // section, roomNumber, labName are optional
          // Accept multiple column name variations for flexibility
          const facultyIdValue = data.facultyId || data.faculty_id || data.faculty_college_code;
          const facultyNameValue = data.facultyName || data.faculty_name;
          const departmentValue = data.department || data.dept;
          const yearValue = data.year || data.academic_year;
          const dayValue = data.day || data.day_of_week;
          const subjectValue = data.subject || data.subject_code;
          const academicYearCSV = data.academicYear || data.academic_year || data.year_sem;
          const hourValue = data.hour || data.period;
          
          const requiredFields = [];
          if (!facultyIdValue || (typeof facultyIdValue === 'string' && facultyIdValue.trim() === '')) requiredFields.push('facultyId/faculty_id/faculty_college_code');
          if (!facultyNameValue || (typeof facultyNameValue === 'string' && facultyNameValue.trim() === '')) requiredFields.push('facultyName/faculty_name');
          if (!departmentValue || (typeof departmentValue === 'string' && departmentValue.trim() === '')) requiredFields.push('department/dept');
          if (!yearValue || (typeof yearValue === 'string' && yearValue.trim() === '')) requiredFields.push('year');
          if (!dayValue || (typeof dayValue === 'string' && dayValue.trim() === '')) requiredFields.push('day/day_of_week');
          if (!subjectValue || (typeof subjectValue === 'string' && subjectValue.trim() === '')) requiredFields.push('subject/subject_code');
          if (!academicYearCSV || (typeof academicYearCSV === 'string' && academicYearCSV.trim() === '')) requiredFields.push('academicYear/academic_year');
          if (!hourValue || hourValue.toString().trim() === '') requiredFields.push('hour/period');
          
          if (requiredFields.length > 0) {
            errors.push({
              row: results.length + 1,
              error: `Missing required fields: ${requiredFields.join(', ')}`,
              data
            });
          } else {
            // Accept both 'hour' and 'period' column names
            const periodStr = (hourValue)?.toString().trim();
            const period = periodStr ? parseInt(periodStr, 10) : null;
            
            if (!period || isNaN(period)) {
              errors.push({
                row: results.length + 1,
                error: `Invalid hour value: ${hourValue}`,
                data
              });
              return; // Skip this row
            }
            
            // Normalize and validate data
            // Use academicYear from CSV or from request body; treat blank as null
            let academicYearValue = academicYearCSV ? academicYearCSV.toString().trim() : '';
            if (!academicYearValue) {
              academicYearValue = bodyAcademicYear ? bodyAcademicYear.trim() : null;
            }
            if (academicYearValue === '') academicYearValue = null;
            
            // Parse boolean fields
            const isLabSession = data.isLabSession ? data.isLabSession?.toString().trim().toUpperCase() === 'TRUE' : (data.is_lab_session?.toString().trim().toUpperCase() === 'TRUE');
            const sessionType = (data.sessionType || data.session_type)?.trim() || 'theory';
            
            results.push({
              facultyId: facultyIdValue.toString().trim(),
              facultyName: facultyNameValue.toString().trim(),
              department: departmentValue.toString().trim(),
              year: yearValue.toString().trim(),
              section: (data.section || data.class_section) ? (data.section || data.class_section).toString().trim() : '',
              day: dayValue.toString().trim(),
              hour: period, // Keep as 'hour' for backward compatibility with TimetableSimple model
              period: period,
              subject: subjectValue.toString().trim(),
              academicYear: academicYearValue,
              roomNumber: (data.roomNumber || data.room_number) ? (data.roomNumber || data.room_number).toString().trim() : null,
              labName: (data.labName || data.lab_name) ? (data.labName || data.lab_name).toString().trim() : null,
              isLabSession: isLabSession,
              sessionType: sessionType.toLowerCase()
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
  } catch (error) {
    return next(new ErrorResponse(`Error parsing CSV file: ${error.message}`, 400));
  }

  // Check if there are valid rows to insert
  if (results.length === 0) {
    // Clean up uploaded file
    if (req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    return next(new ErrorResponse('No valid rows found in CSV file', 400));
  }

  // verify faculty IDs and enforce department consistency
  const facultyIds = [...new Set(results.map(r => r.facultyId))];
  console.log('[DEBUG] Looking up', facultyIds.length, 'unique faculty IDs:', facultyIds);
  
  let faculties = [];
  if (facultyIds.length > 0) {
    try {
      // Get faculty records with LEFT JOIN to department (not INNER JOIN)
      faculties = await Faculty.findAll({
        where: { faculty_college_code: { [Op.in]: facultyIds } },
        include: [{ 
          model: models.Department, 
          as: 'department', 
          attributes: ['short_name', 'full_name', 'id'],
          required: false  // Use LEFT JOIN instead of INNER JOIN
        }],
        attributes: ['faculty_id', 'faculty_college_code', 'Name', 'department_id'],
        subQuery: false,
        limit: 1000
      });
      console.log('[DEBUG] Query returned', faculties.length, 'faculties from DB out of', facultyIds.length, 'requested');
      
      // Log the actual codes returned
      const returnedCodes = faculties.map(f => f.faculty_college_code);
      const missingCodes = facultyIds.filter(id => !returnedCodes.includes(id));
      if (missingCodes.length > 0) {
        console.log('[DEBUG] Missing faculty codes:', missingCodes);
      }
    } catch (dbError) {
      console.error('[ERROR] Faculty lookup failed:', dbError.message);
      console.error('[ERROR] Stack:', dbError.stack);
      if (req.file.path) fs.unlinkSync(req.file.path);
      return next(new ErrorResponse(`Database error while verifying faculty IDs: ${dbError.message}`, 500));
    }
  }

  const deptMap = {};
  const deptIdMap = {};
  const foundFacultyMap = {};
  
  faculties.forEach(f => {
    const code = f.faculty_college_code;
    foundFacultyMap[code] = f;
    
    // Try to get department name from association
    let deptName = '';
    if (f.department) {
      deptName = f.department.short_name || f.department.full_name || '';
    }
    
    // If no department from association, note it
    if (!deptName && f.department_id) {
      console.warn(`[WARN] Faculty ${code} has department_id ${f.department_id} but no department association`);
    }
    
    deptMap[code] = deptName;
    deptIdMap[code] = f.department_id;
  });

  console.log('[DEBUG] Found', Object.keys(deptMap).length, 'faculties in database');
  if (Object.keys(deptMap).length > 0) {
    console.log('[DEBUG] Sample faculty codes:', Object.keys(deptMap).slice(0, 10).join(', '));
  }

  const facultyErrors = [];
  const notFoundFaculties = [];
  results.forEach((r, idx) => {
    if (foundFacultyMap[r.facultyId]) {
      // Faculty found in database
      // NOTE: Removed department-admin restriction to allow uploading timetables
      // for faculty from other departments (common when subjects are cross-departmental)
      
      // Override department from faculty record if mismatch
      const dbDeptName = deptMap[r.facultyId];
      if (dbDeptName && r.department !== dbDeptName) {
        console.warn(`[WARN] Row ${idx + 2}: department mismatch for faculty ${r.facultyId}, using database value "${dbDeptName}"`);
        r.department = dbDeptName;
      }
    } else {
      notFoundFaculties.push(r.facultyId);
      facultyErrors.push(`Row ${idx + 2}: facultyId "${r.facultyId}" not found in faculty_profiles table. Available codes: ${Object.keys(deptMap).slice(0, 10).join(', ')}${Object.keys(deptMap).length > 10 ? ', ...' : ''}`);
    }
  });
  
  if (facultyErrors.length > 0) {
    console.error('[ERROR] Faculty validation failed');
    console.error('[ERROR] Requested faculty IDs:', facultyIds.join(', '));
    console.error('[ERROR] Found in DB:', Object.keys(deptMap).length > 0 ? Object.keys(deptMap).join(', ') : 'NONE');
    console.error('[ERROR] Not found:', notFoundFaculties.join(', '));
    if (req.file.path) fs.unlinkSync(req.file.path);
    return next(new ErrorResponse(`Faculty validation errors:\n${facultyErrors.slice(0, 5).join('\n')}${facultyErrors.length > 5 ? '\n... and ' + (facultyErrors.length - 5) + ' more errors' : ''}`, 400));
  }

  // Check for duplicates within the CSV itself (same faculty, day, hour)
  const seen = new Set();
  const csvDuplicates = [];
  
  results.forEach((row, index) => {
    const key = `${row.facultyId}|${row.day}|${row.hour}`;
    if (seen.has(key)) {
      csvDuplicates.push({
        row: index + 2, // +2 because row 1 is header and index starts at 0
        facultyId: row.facultyId,
        day: row.day,
        hour: row.hour,
        subject: row.subject
      });
    }
    seen.add(key);
  });
  
  if (csvDuplicates.length > 0) {
    // Clean up uploaded file
    if (req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    return next(new ErrorResponse(`Duplicate entries found in CSV file: ${csvDuplicates.map(d => `Row ${d.row} (${d.facultyId} on ${d.day} hour ${d.hour})`).join(', ')}`, 400));
  }

  // Get unique department names from the uploaded data
  // Note: We use department name (string) directly, not departmentId
  
  console.log('[DEBUG] Processing', results.length, 'rows from CSV');

  // Add departmentId to each result - using map creates new array, no reassignment needed
  // Validate all fields and ensure no NaN/undefined values
  // Convert Roman year to numeric
  const romanToNumber = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4,
    'i': 1, 'ii': 2, 'iii': 3, 'iv': 4
  };
  
  results = results.map(row => {
    // Validate and parse hour
    const hourValue = row.hour;
    if (hourValue === undefined || hourValue === null || isNaN(hourValue)) {
      console.error('[ERROR] Invalid hour value:', row.hour, 'Row:', row);
      throw new Error(`Invalid hour value: ${row.hour} at faculty ${row.facultyId}`);
    }
    
    // Convert Roman year to numeric
    let yearValue = row.year?.toString().trim();
    if (romanToNumber[yearValue]) {
      yearValue = romanToNumber[yearValue];
    }
    yearValue = parseInt(yearValue, 10);
    
    // Validate year
    if (yearValue === undefined || yearValue === null || isNaN(yearValue) || ![1,2,3,4].includes(yearValue)) {
      console.error('[ERROR] Invalid year value:', row.year, 'Row:', row);
      throw new Error(`Invalid year value: ${row.year} at faculty ${row.facultyId}`);
    }
    
    return {
      facultyId: row.facultyId,
      facultyName: row.facultyName,
      department: row.department,
      year: yearValue,
      section: row.section || null,
      day: row.day,
      hour: hourValue,
      period: hourValue,
      subject: row.subject,
      academicYear: row.academicYear || null,
      roomNumber: row.roomNumber || null,
      labName: row.labName || null,
      isLabSession: row.isLabSession || false,
      sessionType: row.sessionType || 'theory'
    };
  });

  // Get unique faculty IDs and academic years from the uploaded data
  const uniqueFacultyIds = [...new Set(results.map(row => row.facultyId))];
  // ignore null/undefined academic years when computing unique list
  const uniqueAcademicYears = [...new Set(results.map(row => row.academicYear).filter(v => v != null))];

  // Extract unique subjects and auto-create them in Subject table
  console.log('[DEBUG] Processing subjects from uploaded data...');
  
  // Map each subject to its department_id from faculty records
  const subjectsByDept = {}; // { department_id: Set<subject_name> }
  results.forEach(row => {
    const faculty = foundFacultyMap[row.facultyId];
    if (faculty && faculty.department_id) {
      const deptId = faculty.department_id;
      if (!subjectsByDept[deptId]) {
        subjectsByDept[deptId] = new Set();
      }
      subjectsByDept[deptId].add(row.subject);
    }
  });

  console.log('[DEBUG] Found subjects in', Object.keys(subjectsByDept).length, 'departments');

  // Helper function to generate subject_code from subject_name
  const generateSubjectCode = (subjectName, existingCodes) => {
    // Try using first few words' first letters (e.g., "Data Structures" -> "DS")
    const words = subjectName.trim().split(/\s+/);
    let code = words.map(w => w.charAt(0).toUpperCase()).join('');
    
    // If too short, append random number
    if (code.length < 2) {
      code = subjectName.substring(0, 3).toUpperCase();
    }
    
    // Make sure it's unique
    let uniqueCode = code;
    let suffix = 1;
    while (existingCodes.has(uniqueCode)) {
      uniqueCode = code + suffix;
      suffix++;
    }
    
    existingCodes.add(uniqueCode);
    return uniqueCode;
  };

  // For each department, find or create subjects
  const subjectIdMap = {}; // { subject_name: subject_id } - used for FacultySubjectAssignment
  
  try {
    const { Subject } = models;
    
    for (const [deptIdStr, subjectNames] of Object.entries(subjectsByDept)) {
      const deptId = parseInt(deptIdStr);
      const subjectsArray = Array.from(subjectNames);
      
      console.log(`[DEBUG] Processing ${subjectsArray.length} subjects for department ${deptId}: ${subjectsArray.join(', ')}`);
      
      // Find existing subjects for this department
      const existingSubjects = await Subject.findAll({
        where: {
          department_id: deptId,
          subject_name: { [Op.in]: subjectsArray }
        },
        attributes: ['id', 'subject_name', 'subject_code']
      });
      
      const existingSubjectMap = {}; // { subject_name: { id, subject_code } }
      const existingCodes = new Set();
      existingSubjects.forEach(s => {
        existingSubjectMap[s.subject_name] = { id: s.id, code: s.subject_code };
        existingCodes.add(s.subject_code);
        subjectIdMap[`${deptId}|${s.subject_name}`] = s.id;
      });
      
      console.log(`[DEBUG] Found ${existingSubjects.length} existing subjects for department ${deptId}`);
      
      // Create missing subjects
      const subjectsToCreate = [];
      for (const subjectName of subjectsArray) {
        if (!existingSubjectMap[subjectName]) {
          const generatedCode = generateSubjectCode(subjectName, existingCodes);
          subjectsToCreate.push({
            subject_name: subjectName,
            subject_code: generatedCode,
            department_id: deptId,
            semester: 1, // Default to 1st semester
            type: subjectName.toLowerCase().includes('lab') ? 'Practical' : 'Theory', // Auto-detect lab subjects
            is_laboratory: subjectName.toLowerCase().includes('lab') || false
          });
        }
      }
      
      if (subjectsToCreate.length > 0) {
        console.log(`[DEBUG] Creating ${subjectsToCreate.length} new subjects for department ${deptId}`);
        const createdSubjects = await Subject.bulkCreate(subjectsToCreate, {
          validate: true,
          ignoreDuplicates: true
        });
        
        // Map the created subjects
        createdSubjects.forEach(s => {
          subjectIdMap[`${deptId}|${s.subject_name}`] = s.id;
        });
        
        console.log(`[DEBUG] Created ${createdSubjects.length} subjects: ${createdSubjects.map(s => s.subject_name).join(', ')}`);
      }
    }
  } catch (error) {
    console.error('[ERROR] Failed to create subjects:', error.message);
    console.error('[ERROR] Stack:', error.stack);
    if (req.file.path) fs.unlinkSync(req.file.path);
    // Continue with timetable upload even if subject creation fails
    // This maintains backward compatibility
    console.warn('[WARN] Continuing with timetable upload despite subject creation issue');
  }

  // Start transaction
  let transaction;
  try {
    transaction = await sequelize.transaction();
    
    // Delete existing records for uploaded faculty and academic years
    // This allows re-uploading without duplicate errors
    let deletedCount = 0;
    if (uniqueFacultyIds.length > 0 && uniqueAcademicYears.length > 0) {
      deletedCount = await TimetableSimple.destroy({
        where: {
          facultyId: {
            [Op.in]: uniqueFacultyIds
          },
          academicYear: {
            [Op.in]: uniqueAcademicYears
          }
        },
        transaction,
        force: true // Force delete even if soft delete is enabled
      });
      console.log('[DEBUG] Deleted', deletedCount, 'existing records for re-upload');
    }

    // Bulk insert all records
    const insertedRecords = await TimetableSimple.bulkCreate(results, {
      validate: true,
      ignoreDuplicates: false,
      transaction
    });

    // Create FacultySubjectAssignment records for auto-mapped subjects
    console.log('[DEBUG] Creating FacultySubjectAssignment records...');
    
    const { FacultySubjectAssignment } = models;
    const assignmentsToCreate = [];
    const processedAssignments = new Set(); // Track to avoid duplicates
    
    results.forEach(row => {
      const faculty = foundFacultyMap[row.facultyId];
      if (!faculty) return; // Skip if faculty not found (shouldn't happen after validation)
      
      const deptId = faculty.department_id;
      const subjectKey = `${deptId}|${row.subject}`;
      const subjectId = subjectIdMap[subjectKey];
      
      if (subjectId) {
        // Create unique key to prevent duplicate assignments
        const assignmentKey = `${faculty.faculty_id}|${subjectId}|${row.academicYear}`;
        
        if (!processedAssignments.has(assignmentKey)) {
          assignmentsToCreate.push({
            faculty_id: faculty.faculty_id,
            subject_id: subjectId,
            academic_year: row.academicYear || new Date().getFullYear().toString(),
            semester: row.year, // Use year from timetable as semester
            status: 'active'
          });
          processedAssignments.add(assignmentKey);
        }
      }
    });

    if (assignmentsToCreate.length > 0) {
      try {
        const createdAssignments = await FacultySubjectAssignment.bulkCreate(assignmentsToCreate, {
          validate: true,
          ignoreDuplicates: true,
          transaction
        });
        console.log(`[DEBUG] Created ${createdAssignments.length} FacultySubjectAssignment records`);
      } catch (assignmentError) {
        console.error('[WARN] Failed to create some FacultySubjectAssignment records:', assignmentError.message);
        // Continue despite assignment errors - don't let this break the whole transaction
      }
    }

    // Commit transaction
    await transaction.commit();

    // Clean up uploaded file
    if (req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    // Format response data for preview
    const previewData = insertedRecords.slice(0, 50).map(record => ({
      id: record.id,
      facultyId: record.facultyId,
      facultyName: record.facultyName,
      department: record.department,
      year: record.year,
      section: record.section,
      day: record.day,
      hour: record.hour,
      period: record.hour,
      subject: record.subject,
      academicYear: record.academicYear,
      roomNumber: record.roomNumber,
      labName: record.labName,
      isLabSession: record.isLabSession,
      sessionType: record.sessionType
    }));

    console.log('[DEBUG] Bulk upload successful - Inserted:', insertedRecords.length, 'records, Deleted:', deletedCount, 'old records');

    res.status(200).json({
      success: true,
      message: 'Timetable uploaded successfully and replaced old records',
      insertedCount: insertedRecords.length,
      deletedCount: deletedCount,
      preview: previewData,
      total: insertedRecords.length
    });

  } catch (error) {
    // Rollback transaction on error if it exists
    console.error('[ERROR] Bulk upload failed:', error.message);
    console.error('[ERROR] Stack:', error.stack);
    
    if (transaction) {
      await transaction.rollback();
    }

    // Clean up uploaded file
    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }

    // Handle duplicate entry error
    if (error.name === 'SequelizeUniqueConstraintError') {
      const duplicateField = error.errors[0]?.path || 'facultyId, day, hour';
      return next(new ErrorResponse(`Duplicate entry found for ${duplicateField}. Transaction rolled back.`, 400));
    }

    // Handle validation error
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(e => e.message).join(', ');
      return next(new ErrorResponse(`Validation error: ${validationErrors}. Transaction rolled back.`, 400));
    }

    // Generic error - return the actual error message
    return next(new ErrorResponse(`Error uploading timetable: ${error.message}`, 500));
  }
});

// @desc      Get personal timetable for logged-in faculty
// @route     GET /api/v1/timetable/faculty/me
// @access    Private (Faculty only)
export const getMyTimetable = asyncHandler(async (req, res, next) => {
  // Get facultyId from logged-in user (JWT token)
  // The auth middleware normalizes faculty_id/facultyId
  const facultyId = req.user.facultyId || req.user.faculty_id || req.user.id;
  
  console.log('[DEBUG] getMyTimetable - req.user:', JSON.stringify(req.user));
  console.log('[DEBUG] getMyTimetable - extracted facultyId:', facultyId);
  
  if (!facultyId) {
    console.log('[DEBUG] getMyTimetable - Faculty ID not found in token');
    return next(new ErrorResponse('Faculty ID not found in token', 400));
  }

  const timetable = await TimetableSimple.findAll({
    where: { facultyId: String(facultyId) },
    attributes: ['id', 'facultyId', 'day', 'hour', 'subject', 'section', 'department', 'year', 'academicYear'],
    order: [
      // Use literal query for FIELD function to order by day of week
      [sequelize.literal("FIELD(day, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')"), 'ASC'],
      ['hour', 'ASC']
    ]
  });

  console.log('[DEBUG] getMyTimetable - Query result count:', timetable.length);
  console.log('[DEBUG] getMyTimetable - Query facultyId used:', String(facultyId));

  if (!timetable || timetable.length === 0) {
    // Check if any data exists at all
    const totalCount = await TimetableSimple.count();
    console.log('[DEBUG] getMyTimetable - Total timetable records in DB:', totalCount);
    
    return res.status(200).json({
      success: true,
      timetable: [],
      message: totalCount === 0 ? 'No timetable data in system' : 'No timetable found for this faculty'
    });
  }

  // Format response
  const formattedTimetable = timetable.map(record => ({
    id: record.id,
    facultyId: record.facultyId,
    day: record.day,
    hour: record.hour,
    subject: record.subject,
    section: record.section,
    department: record.department,
    year: record.year,
    academicYear: record.academicYear
  }));

  console.log('[DEBUG] getMyTimetable - Returning timetable records:', formattedTimetable.length);

  res.status(200).json({
    success: true,
    timetable: formattedTimetable
  });
});

// @desc      Get personal timetable for logged-in student
// @route     GET /api/v1/timetable/student/me
// @access    Private (Student only)
export const getMyStudentTimetable = asyncHandler(async (req, res, next) => {
  // Get student using primary key id from JWT token
  // DO NOT use userId or departmentId - these columns may not exist in the database
  // Exclude problematic fields from query
  const student = await models.Student.findByPk(req.user.id, {
    attributes: { exclude: ['userId', 'departmentId'] }
  });

  if (!student) {
    console.log('[DEBUG] getMyStudentTimetable - Student record not found');
    return next(new ErrorResponse('Student record not found', 404));
  }

  console.log('[DEBUG] getMyStudentTimetable - Student found:', student.id, student.studentId);

  // Use department from JWT token directly (already contains department short_name)
  // The JWT token includes department info from login time
  const departmentName = req.user.department;
  const yearValue = req.user.year || student.year;
  const sectionValue = req.user.section || student.section || 'A';

  console.log('[DEBUG] getMyStudentTimetable - Using from JWT:', {
    studentId: student.id,
    departmentName,
    yearValue,
    sectionValue
  });

  if (!departmentName) {
    console.log('[DEBUG] getMyStudentTimetable - Department not found in JWT');
    return next(new ErrorResponse('Department not assigned to student', 400));
  }

  console.log('[DEBUG] getMyStudentTimetable - Student details:', {
    studentId: student.id,
    departmentName,
    yearValue,
    sectionValue,
    batch: student.batch
  });

  // Build query using department name, year (integer), and section
  const timetableQuery = {
    department: departmentName,
    year: yearValue
  };
  
  // Add section to query if available
  if (sectionValue) {
    timetableQuery.section = sectionValue;
  }
  
  const timetable = await TimetableSimple.findAll({
    where: timetableQuery,
    order: [
      [sequelize.literal("FIELD(day, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')"), 'ASC'],
      ['hour', 'ASC']
    ]
  });

  console.log('[DEBUG] getMyStudentTimetable - Query result count:', timetable.length);

  if (!timetable || timetable.length === 0) {
    // Check if any data exists at all
    const totalCount = await TimetableSimple.count();
    console.log('[DEBUG] getMyStudentTimetable - Total timetable records in DB:', totalCount);
    
    return res.status(200).json({
      success: true,
      timetable: [],
      message: totalCount === 0 ? 'No timetable data in system' : 'No timetable found for your class'
    });
  }

  // Format response
  const formattedTimetable = timetable.map(record => ({
    day: record.day,
    hour: record.hour,
    subject: record.subject,
    facultyName: record.facultyName
  }));

  console.log('[DEBUG] getMyStudentTimetable - Returning timetable records:', formattedTimetable.length);

  res.status(200).json({
    success: true,
    timetable: formattedTimetable
  });
});

// @desc      Get personal timetable for a faculty (by ID)
// @route     GET /api/v1/timetable/faculty/:facultyId
// @access    Private
export const getPersonalTimetable = asyncHandler(async (req, res, next) => {
  const { facultyId } = req.params;

  if (!facultyId) {
    return next(new ErrorResponse('Please provide facultyId as parameter', 400));
  }

  const timetable = await TimetableSimple.findAll({
    where: { facultyId },
    attributes: ['day', 'hour', 'subject', 'section', 'department', 'year', 'academicYear'],
    order: [
      // Use literal query for FIELD function to order by day of week
      [sequelize.literal("FIELD(day, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')"), 'ASC'],
      ['hour', 'ASC']
    ]
  });

  if (!timetable || timetable.length === 0) {
    return next(new ErrorResponse(`No timetable found for faculty ID: ${facultyId}`, 404));
  }

  // Format response
  const formattedTimetable = timetable.map(record => ({
    day: record.day,
    hour: record.hour,
    subject: record.subject,
    section: record.section,
    department: record.department,
    year: record.year,
    academicYear: record.academicYear
  }));

  res.status(200).json({
    success: true,
    count: formattedTimetable.length,
    data: formattedTimetable
  });
});
