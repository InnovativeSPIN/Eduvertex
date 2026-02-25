import { models } from './models/index.js';

const { Subject, Department } = models;

// Define subjects for each department
const subjectsByDepartment = {
  1: [ // CSE
    { code: 'CSE101', name: 'Introduction to Programming', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'CSE102', name: 'Data Structures', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'CSE103', name: 'Digital Logic Design', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'CSE104', name: 'Web Development Basics', semester: 2, sem_type: 'even', credits: 4, type: 'Theory+Practical' },
    { code: 'CSE105', name: 'Database Management Systems', semester: 2, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'CSE106', name: 'Operating Systems', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'CSE107', name: 'Computer Networks', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'CSE108', name: 'Software Engineering', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'CSE109', name: 'Algorithms and Complexity', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'CSE110', name: 'Artificial Intelligence', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
  ],
  2: [ // ECE
    { code: 'ECE101', name: 'Circuit Theory', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'ECE102', name: 'Electronic Devices and Circuits', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'ECE103', name: 'Digital Electronics', semester: 2, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'ECE104', name: 'Signals and Systems', semester: 2, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'ECE105', name: 'Electromagnetic Theory', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'ECE106', name: 'Microprocessors and Microcontrollers', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'ECE107', name: 'Communication Systems', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'ECE108', name: 'Control Systems', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'ECE109', name: 'Power Systems', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'ECE110', name: 'VLSI Design', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
  ],
  3: [ // Mechanical
    { code: 'ME101', name: 'Engineering Mechanics', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'ME102', name: 'Strength of Materials', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'ME103', name: 'Thermodynamics', semester: 2, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'ME104', name: 'Fluid Mechanics', semester: 2, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'ME105', name: 'Manufacturing Processes', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'ME106', name: 'Heat Transfer', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'ME107', name: 'Machine Design', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'ME108', name: 'Dynamics of Machinery', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'ME109', name: 'Power Plant Engineering', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'ME110', name: 'Automobile Engineering', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
  ],
  4: [ // Civil
    { code: 'CE101', name: 'Surveying', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'CE102', name: 'Engineering Geology', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'CE103', name: 'Structural Analysis', semester: 2, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'CE104', name: 'Hydraulics and Fluid Mechanics', semester: 2, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'CE105', name: 'Geotechnical Engineering', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'CE106', name: 'Water Resources Engineering', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'CE107', name: 'RCC Design', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'CE108', name: 'Steel Design', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'CE109', name: 'Transportation Engineering', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'CE110', name: 'Environmental Engineering', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
  ],
  5: [ // EEE
    { code: 'EEE101', name: 'Basic Electrical Engineering', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'EEE102', name: 'AC and DC Circuits', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'EEE103', name: 'Electromagnetic Induction', semester: 2, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'EEE104', name: 'Electrical Machines', semester: 2, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'EEE105', name: 'Power Systems', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'EEE106', name: 'Power Generation', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'EEE107', name: 'High Voltage Engineering', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'EEE108', name: 'Power Distribution', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'EEE109', name: 'Industrial Drives', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'EEE110', name: 'Smart Grid Technology', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
  ],
  6: [ // IT
    { code: 'IT101', name: 'Introduction to IT', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'IT102', name: 'Programming Languages', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'IT103', name: 'Web Technologies', semester: 2, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'IT104', name: 'Database Systems', semester: 2, sem_type: 'even', credits: 4, type: 'Theory+Practical' },
    { code: 'IT105', name: 'Cloud Computing', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'IT106', name: 'Network Security', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'IT107', name: 'Data Analytics', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'IT108', name: 'Machine Learning', semester: 4, sem_type: 'even', credits: 4, type: 'Theory+Practical' },
    { code: 'IT109', name: 'Mobile Application Development', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'IT110', name: 'IT Project Management', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
  ],
  7: [ // Chemistry
    { code: 'CHE101', name: 'Physical Chemistry', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'CHE102', name: 'Organic Chemistry', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'CHE103', name: 'Inorganic Chemistry', semester: 2, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'CHE104', name: 'Analytical Chemistry', semester: 2, sem_type: 'even', credits: 4, type: 'Theory+Practical' },
    { code: 'CHE105', name: 'Chemical Engineering Fundamentals', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'CHE106', name: 'Process Engineering', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'CHE107', name: 'Industrial Chemistry', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'CHE108', name: 'Polymer Science', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'CHE109', name: 'Environmental Chemistry', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'CHE110', name: 'Biochemistry', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
  ],
  10: [ // Physics
    { code: 'PHY101', name: 'Classical Mechanics', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'PHY102', name: 'Thermodynamics', semester: 1, sem_type: 'odd', credits: 4, type: 'Theory+Practical' },
    { code: 'PHY103', name: 'Waves and Oscillations', semester: 2, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'PHY104', name: 'Optics', semester: 2, sem_type: 'even', credits: 4, type: 'Theory+Practical' },
    { code: 'PHY105', name: 'Electricity and Magnetism', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'PHY106', name: 'Modern Physics', semester: 3, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'PHY107', name: 'Quantum Mechanics', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'PHY108', name: 'Solid State Physics', semester: 4, sem_type: 'even', credits: 4, type: 'Theory' },
    { code: 'PHY109', name: 'Astrophysics', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
    { code: 'PHY110', name: 'Nuclear Physics', semester: 5, sem_type: 'odd', credits: 4, type: 'Theory' },
  ],
};

const addSubjects = async () => {
  try {
    console.log('Starting bulk subject creation...');
    
    for (const [deptId, subjects] of Object.entries(subjectsByDepartment)) {
      const departmentId = parseInt(deptId);
      console.log(`\nAdding subjects for Department ID: ${departmentId}`);
      
      let successCount = 0;
      let failCount = 0;
      
      for (const subjectData of subjects) {
        try {
          // Check if subject code already exists
          const existingSubject = await Subject.findOne({ 
            where: { subject_code: subjectData.code } 
          });
          
          if (existingSubject) {
            console.log(`  ✗ ${subjectData.code} - Already exists`);
            failCount++;
            continue;
          }
          
          // Create subject
          const subject = await Subject.create({
            subject_code: subjectData.code,
            subject_name: subjectData.name,
            department_id: departmentId,
            semester: subjectData.semester,
            sem_type: subjectData.sem_type,
            credits: subjectData.credits,
            type: subjectData.type,
            is_elective: false,
            is_laboratory: subjectData.type.includes('Practical'),
            status: 'active',
            created_by: 1
          });
          
          console.log(`  ✓ ${subjectData.code} - ${subjectData.name}`);
          successCount++;
        } catch (error) {
          console.log(`  ✗ ${subjectData.code} - Error: ${error.message}`);
          failCount++;
        }
      }
      
      console.log(`  Summary: ${successCount} created, ${failCount} failed`);
    }
    
    console.log('\n✓ Bulk subject creation completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addSubjects();
