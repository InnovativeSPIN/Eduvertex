import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Student = sequelize.define('Student', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  rollNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alternatePhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  linkedinUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  bloodGroup: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allowNull: true
  },
  address: {
    type: DataTypes.JSON,
    allowNull: true
  },
  permanentAddress: {
    type: DataTypes.JSON,
    allowNull: true
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  batch: {
    type: DataTypes.STRING,
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  section: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admissionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  admissionType: {
    type: DataTypes.ENUM('regular', 'lateral', 'management'),
    defaultValue: 'regular'
  },
  residenceType: {
    type: DataTypes.ENUM('hosteller', 'day_scholar', 'other'),
    allowNull: true,
    comment: 'Hostel or Day Scholar'
  },
  nationality: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  religion: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(30),
    allowNull: true,
    comment: 'General / OBC / SC / ST / etc.'
  },
  aadharNo: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  motherTongue: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  parentInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'father, mother, guardian, siblings – structured JSON'
  },
  references: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of reference/relative contacts from ReferenceInfo page'
  },
  previousEducation: {
    type: DataTypes.JSON,
    allowNull: true
  },
  feeStatus: {
    type: DataTypes.ENUM('paid', 'pending', 'partial'),
    defaultValue: 'pending'
  },
  scholarshipDetails: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'graduated', 'dropped', 'suspended'),
    defaultValue: 'active'
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true
  },
  photo: {
    type: DataTypes.STRING,
    defaultValue: 'default-student.png'
  }
}, {
  tableName: 'students',
  timestamps: true
});

Student.prototype.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

Student.generateStudentId = async function (batch, departmentCode) {
  const count = await Student.count({ where: { batch } });
  const deptCode = departmentCode.slice(0, 3).toUpperCase();
  return `${batch}${deptCode}${String(count + 1).padStart(4, '0')}`;
};

export default Student;
