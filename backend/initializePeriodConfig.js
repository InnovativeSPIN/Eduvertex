import { models } from './models/index.js';

const { PeriodConfig, YearBreakTiming } = models;

const initializePeriodConfig = async () => {
  try {
    console.log('Initializing period configuration and break timings...\n');

    // Define 7 periods per day with break at period 3
    const globalPeriods = [
      { period_number: 1, start_time: '09:00', end_time: '09:50', duration_minutes: 50, is_break: false },
      { period_number: 2, start_time: '09:50', end_time: '10:40', duration_minutes: 50, is_break: false },
      { period_number: 3, start_time: '10:40', end_time: '11:10', duration_minutes: 30, is_break: true, break_name: 'Tea Break' },
      { period_number: 4, start_time: '11:10', end_time: '12:00', duration_minutes: 50, is_break: false },
      { period_number: 5, start_time: '12:00', end_time: '12:50', duration_minutes: 50, is_break: false },
      { period_number: 6, start_time: '12:50', end_time: '01:30', duration_minutes: 40, is_break: true, break_name: 'Lunch' },
      { period_number: 7, start_time: '01:30', end_time: '02:20', duration_minutes: 50, is_break: false }
    ];

    // Add global period configuration
    console.log('Adding global period configuration...');
    for (const period of globalPeriods) {
      const exists = await PeriodConfig.findOne({
        where: { period_number: period.period_number, department_id: null }
      });

      if (!exists) {
        await PeriodConfig.create({
          department_id: null,
          ...period,
          status: 'active'
        });
        console.log(`  ✓ Period ${period.period_number}: ${period.start_time} - ${period.end_time}`);
      }
    }

    // Define break timings for different years
    const breakTimings = [
      // 1st & 2nd Year - Single break at 10:40-11:10
      { year: '1st', department_id: null, break_number: 1, break_name: 'Tea Break', start_time: '10:40', end_time: '11:10', duration_minutes: 30 },
      { year: '1st', department_id: null, break_number: 2, break_name: 'Lunch', start_time: '12:50', end_time: '01:30', duration_minutes: 40 },
      
      { year: '2nd', department_id: null, break_number: 1, break_name: 'Tea Break', start_time: '10:40', end_time: '11:10', duration_minutes: 30 },
      { year: '2nd', department_id: null, break_number: 2, break_name: 'Lunch', start_time: '12:50', end_time: '01:30', duration_minutes: 40 },

      // 3rd & 4th Year - Extended break (different timing)
      { year: '3rd', department_id: null, break_number: 1, break_name: 'Tea Break', start_time: '10:40', end_time: '11:00', duration_minutes: 20 },
      { year: '3rd', department_id: null, break_number: 2, break_name: 'Lunch', start_time: '12:50', end_time: '01:20', duration_minutes: 30 },

      { year: '4th', department_id: null, break_number: 1, break_name: 'Tea Break', start_time: '10:40', end_time: '11:00', duration_minutes: 20 },
      { year: '4th', department_id: null, break_number: 2, break_name: 'Lunch', start_time: '12:50', end_time: '01:20', duration_minutes: 30 }
    ];

    console.log('\nAdding break timings for different years...');
    for (const timing of breakTimings) {
      const exists = await YearBreakTiming.findOne({
        where: {
          year: timing.year,
          break_number: timing.break_number,
          department_id: timing.department_id
        }
      });

      if (!exists) {
        await YearBreakTiming.create(timing);
        console.log(`  ✓ ${timing.year} Year - ${timing.break_name}: ${timing.start_time} - ${timing.end_time}`);
      }
    }

    console.log('\n✓ Period configuration and break timings initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

initializePeriodConfig();
