import { sequelize } from './config/db.js';

const verifyDatabase = async () => {
  try {
    console.log('🔍 Verifying Timetable Management Database Setup...\n');

    // Check if tables exist
    const tablesToCheck = [
      'timetable_master',
      'timetable_details',
      'faculty_leave_schedules',
      'timetable_staff_alterations',
      'year_break_timings',
      'period_config'
    ];

    console.log('📊 Checking Tables...');
    for (const tableName of tablesToCheck) {
      const result = await sequelize.query(
        `SELECT COUNT(*) as count FROM information_schema.TABLES 
         WHERE TABLE_SCHEMA = '${process.env.MYSQL_DATABASE || 'eduvertex'}' 
         AND TABLE_NAME = ?`,
        { replacements: [tableName], type: sequelize.QueryTypes.SELECT }
      );

      const exists = result[0]?.count > 0;
      const status = exists ? '✅' : '❌';
      console.log(`  ${status} ${tableName}`);
    }

    console.log('\n📋 Checking Period Configuration...');
    const periodCount = await sequelize.query(
      'SELECT COUNT(*) as count FROM period_config',
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log(`  ℹ️  Periods configured: ${periodCount[0]?.count || 0} (Expected: 7)`);

    console.log('\n⏰ Checking Year Break Timings...');
    const breaksByYear = await sequelize.query(
      'SELECT year, COUNT(*) as count FROM year_break_timings GROUP BY year ORDER BY year',
      { type: sequelize.QueryTypes.SELECT }
    );
    if (breaksByYear.length === 0) {
      console.log('  ⚠️  No break timings found');
    } else {
      breaksByYear.forEach(row => {
        console.log(`  ✅ ${row.year} year: ${row.count} break(s)`);
      });
    }

    console.log('\n🔗 Checking Foreign Key Relationships...');
    const fkCheck = await sequelize.query(
      `SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE TABLE_SCHEMA = '${process.env.MYSQL_DATABASE || 'eduvertex'}'
       AND TABLE_NAME IN ('timetable_master', 'timetable_details', 'timetable_staff_alterations')
       AND REFERENCED_TABLE_NAME IS NOT NULL`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (fkCheck.length > 0) {
      console.log(`  ✅ Foreign keys configured: ${fkCheck.length}`);
      fkCheck.forEach(fk => {
        console.log(`     - ${fk.TABLE_NAME}.${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}`);
      });
    } else {
      console.log('  ⚠️  No foreign keys found');
    }

    console.log('\n📈 Summary:');
    console.log('  ✅ Database verification complete!');
    console.log('\n💡 If any tables are missing, run:');
    console.log('     node runMigration008.js');

    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
};

verifyDatabase();
