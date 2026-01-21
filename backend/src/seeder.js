const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const User = require('./modules/admin/models/User.model');
const Department = require('./modules/faculty/models/Department.model');
const Subject = require('./modules/faculty/models/Subject.model');
const PeriodConfig = require('./modules/timetable/models/PeriodConfig.model');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample data
const users = [
  {
    name: 'Super Admin',
    email: 'superadmin@eduvertex.com',
    password: 'admin123',
    role: 'superadmin',
    phone: '9876543210'
  },
  {
    name: 'Executive Admin',
    email: 'executive@eduvertex.com',
    password: 'admin123',
    role: 'executiveadmin',
    phone: '9876543211'
  },
  {
    name: 'Academic Admin',
    email: 'academic@eduvertex.com',
    password: 'admin123',
    role: 'academicadmin',
    phone: '9876543212'
  }
];

const departments = [
  { name: 'Computer Science', code: 'CSE', description: 'Computer Science and Engineering' },
  { name: 'Electronics', code: 'ECE', description: 'Electronics and Communication Engineering' },
  { name: 'Mechanical', code: 'MECH', description: 'Mechanical Engineering' },
  { name: 'Civil', code: 'CIVIL', description: 'Civil Engineering' },
  { name: 'Electrical', code: 'EEE', description: 'Electrical and Electronics Engineering' }
];

const periodConfig = {
  name: 'Default Schedule',
  periods: [
    { periodNumber: 1, startTime: '09:00', endTime: '09:50', duration: 50, type: 'class' },
    { periodNumber: 2, startTime: '09:50', endTime: '10:40', duration: 50, type: 'class' },
    { periodNumber: 3, startTime: '10:40', endTime: '11:00', duration: 20, type: 'break' },
    { periodNumber: 4, startTime: '11:00', endTime: '11:50', duration: 50, type: 'class' },
    { periodNumber: 5, startTime: '11:50', endTime: '12:40', duration: 50, type: 'class' },
    { periodNumber: 6, startTime: '12:40', endTime: '13:30', duration: 50, type: 'lunch' },
    { periodNumber: 7, startTime: '13:30', endTime: '14:20', duration: 50, type: 'class' },
    { periodNumber: 8, startTime: '14:20', endTime: '15:10', duration: 50, type: 'class' },
    { periodNumber: 9, startTime: '15:10', endTime: '16:00', duration: 50, type: 'class' }
  ],
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  isDefault: true
};

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Department.create(departments);
    await PeriodConfig.create(periodConfig);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Department.deleteMany();
    await Subject.deleteMany();
    await PeriodConfig.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import or -d to delete data');
  process.exit();
}
