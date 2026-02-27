import fs from 'fs';
import path from 'path';
import { sequelize } from './config/db.js';

const runMigration008 = async () => {
  try {
    console.log('🔄 Starting Timetable Management Migration (008)...');

    // Read SQL file
    const sqlFilePath = path.join(process.cwd(), 'migrations', '008_timetable_management.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      const trimmedStmt = statement.trim();
      if (trimmedStmt) {
        console.log(`⏳ Executing: ${trimmedStmt.substring(0, 60)}...`);
        await sequelize.query(trimmedStmt);
      }
    }

    console.log('✅ Migration 008 completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - timetable_master');
    console.log('   - timetable_details');
    console.log('   - faculty_leave_schedules');
    console.log('   - timetable_staff_alterations');
    console.log('   - year_break_timings');
    console.log('   - period_config (updated)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

runMigration008();
