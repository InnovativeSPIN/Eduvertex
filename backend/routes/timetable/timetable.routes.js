import express from 'express';
// path module no longer needed; template is sent as hardcoded CSV
import {
  getAllTimetables,
  getTimetable,
  getTimetableByClass,
  getTimetableByFaculty,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  addSlot,
  updateSlot,
  removeSlot,
  getPeriodConfigs,
  createPeriodConfig,
  getTodaySchedule,
  getFacultyByYear,
  getFacultyTimetable
} from '../../controllers/timetable/timetable.controller.js';

import { bulkUploadTimetable, getPersonalTimetable, getMyTimetable, getMyStudentTimetable } from '../../controllers/timetable/timetable-bulk.controller.js';

import { protect, authorize } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

// Multer error handler for bulk upload
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error('Multer error in route:', err.message);
    console.error('Multer error code:', err.code);
    
    // Handle specific multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: 'File size exceeds 50MB limit' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, error: 'Only one file is allowed' });
    }
    if (err.code === 'LIMIT_FIELD_KEY') {
      return res.status(400).json({ success: false, error: 'Field name is too long' });
    }
    if (err.code === 'LIMIT_FIELD_VALUE') {
      return res.status(400).json({ success: false, error: 'Field value is too large' });
    }
    if (err.code === 'LIMIT_FIELDS') {
      return res.status(400).json({ success: false, error: 'Too many form fields' });
    }
    // For Unexpected end of form, likely a connection issue or malformed request
    if (err.message && err.message.includes('Unexpected end of form')) {
      console.error('Form boundary issue detected. Check form encoding and content-length header.');
      return res.status(400).json({ success: false, error: 'Invalid or incomplete file upload. Ensure the CSV file is properly formatted and file upload completed successfully.' });
    }
    // Generic error
    return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
  }
  next();
};

// Wrap multer to properly handle errors
const uploadWithErrorHandling = (req, res, next) => {
  console.log('uploadWithErrorHandling called');
  console.log('Headers:', { 'content-type': req.headers['content-type'], authorization: req.headers.authorization ? 'present' : 'missing' });
  console.log('Content-Length:', req.headers['content-length']);
  upload.single('file')(req, res, (err) => {
    console.log('After multer.single - err:', err ? err.message : 'none', 'file:', req.file ? req.file.filename : 'none');
    handleMulterError(err, req, res, next);
  });
};

// All routes require authentication

// serve CSV format template directly (no auth required)
router.get('/format', (req, res) => {
  // return template with all required headers including new room/lab fields
  const csv = `facultyId,facultyName,department,year,section,day,hour,subject,academicYear,roomNumber,labName,isLabSession,sessionType
CS12,Dr. John Smith,CSE,3,A,Monday,1,Data Structures,2024-2028,201,,FALSE,Theory
CS12,Dr. John Smith,CSE,3,A,Monday,2,Data Structures,2024-2028,201,,FALSE,Theory
CS15,Prof. Sarah Jones,CSE,3,A,Monday,4,DBMS Lab,2024-2028,CS-LAB-1,DBMS Lab,TRUE,Lab
CS15,Prof. Sarah Jones,CSE,3,A,Monday,5,DBMS Lab,2024-2028,CS-LAB-1,DBMS Lab,TRUE,Lab
CS20,Dr. Michael Brown,CSE,3,A,Monday,6,Operating Systems,2024-2028,202,,FALSE,Theory`;
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=Timetable_Format.csv');
  res.send(csv);
});

// Debug endpoint - List all faculty codes in database (admin only)
router.get('/debug/faculty-codes', authorize('superadmin', 'super-admin', 'department-admin'), async (req, res, next) => {
  try {
    const { models } = await import('../../models/index.js');
    const { Faculty } = models;
    
    const faculties = await Faculty.findAll({
      attributes: ['faculty_college_code', 'Name', 'department_id'],
      order: [['faculty_college_code', 'ASC']],
      limit: 1000,
      raw: true
    });
    
    const codes = faculties.map(f => f.faculty_college_code);
    
    res.status(200).json({
      success: true,
      total: faculties.length,
      codes: codes,
      sample: faculties.slice(0, 20),
      message: `Found ${faculties.length} faculty members in database`
    });
  } catch (error) {
    console.error('[DEBUG] Error fetching faculty codes:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bulk upload timetable (with file upload) - file parsing BEFORE auth
router.post('/bulk-upload', uploadWithErrorHandling, protect, bulkUploadTimetable);

// Get today's schedule for logged in user
router.get('/today', getTodaySchedule);

// Department Admin Routes - Faculty personal timetable (simpler paths)
router.get('/year/:year/faculties', authorize('department-admin'), getFacultyByYear);

// Department Admin Routes - Faculty personal timetable (admin-specific paths)
router.get('/admin/faculty-by-year/:year', authorize('department-admin'), getFacultyByYear);
router.get('/admin/faculty-timetable/:facultyId', authorize('department-admin'), getFacultyTimetable);

// Get personal timetable for logged-in faculty (protected, faculty role only)
router.get('/faculty/me', authorize('faculty'), getMyTimetable);

// Get personal timetable for logged-in student (protected, student role only)
router.get('/student/me', authorize('student'), getMyStudentTimetable);

// Get personal timetable for a faculty
router.get('/personal/:facultyId', getPersonalTimetable);

// Period configuration routes
router.route('/config/periods')
  .get(getPeriodConfigs)
  .post(authorize('superadmin', 'super-admin', 'executiveadmin', 'academicadmin'), createPeriodConfig);

// Get timetable by class or faculty
router.get('/class/:classId', getTimetableByClass);
router.get('/faculty/:facultyId', getTimetableByFaculty);

// Main timetable routes
router.route('/')
  .get(getAllTimetables)
  .post(authorize('superadmin', 'super-admin', 'executiveadmin', 'academicadmin'), createTimetable);

router.route('/:id')
  .get(getTimetable)
  .put(authorize('superadmin', 'super-admin', 'executiveadmin', 'academicadmin'), updateTimetable)
  .delete(authorize('superadmin', 'super-admin', 'executiveadmin', 'academicadmin'), deleteTimetable);

// Slot management routes
router.route('/:id/slots')
  .post(authorize('superadmin', 'super-admin', 'executiveadmin', 'academicadmin'), addSlot);

router.route('/:id/slots/:slotId')
  .put(authorize('superadmin', 'super-admin', 'executiveadmin', 'academicadmin'), updateSlot)
  .delete(authorize('superadmin', 'super-admin', 'executiveadmin', 'academicadmin'), removeSlot);

export default router;
