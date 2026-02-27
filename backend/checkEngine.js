import { sequelize } from './config/db.js';

const checkEngine = async () => {
  try {
    const tables = ['departments', 'users', 'classes', 'subjects', 'faculty_profiles'];
    
    for (const table of tables) {
      const result = await sequelize.query(`SELECT CCSA.TABLE_NAME, CCSA.COLUMN_NAME, CCSA.CONSTRAINT_NAME FROM INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE CCSA WHERE CCSA.TABLE_NAME = ?`, {
        replacements: [table],
        type: sequelize.QueryTypes.SELECT
      });
      
      const engine = await sequelize.query(`SELECT ENGINE FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ?`, {
        replacements: [table],
        type: sequelize.QueryTypes.SELECT
      });
      
      console.log(`\n${table}: Engine = ${engine[0]?.ENGINE}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
};

checkEngine();
