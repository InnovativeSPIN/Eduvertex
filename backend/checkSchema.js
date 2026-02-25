import { sequelize } from './config/db.js';

const checkSchema = async () => {
  try {
    const tables = ['departments', 'users', 'classes', 'subjects', 'faculty_profiles'];
    
    for (const table of tables) {
      console.log(`\n📋 Table: ${table}`);
      const result = await sequelize.query(`DESCRIBE ${table}`);
      result[0].forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
};

checkSchema();
