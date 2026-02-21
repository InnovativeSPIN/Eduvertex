-- Migration to alter status enums on profile tables

-- change faculty_profiles.status to active/completed/inactive
ALTER TABLE `faculty_profiles`
  MODIFY COLUMN `status` ENUM('active','completed','inactive') NOT NULL DEFAULT 'active';

-- change student_profile.status to match new states
ALTER TABLE `student_profile`
  MODIFY COLUMN `status` ENUM('active','completed','inactive') NOT NULL DEFAULT 'active';

-- map old values to new ones
UPDATE `faculty_profiles`
   SET `status` = 'inactive'
   WHERE `status` IN ('on_leave','retired');

UPDATE `student_profile`
   SET `status` = 'completed'
   WHERE `status` = 'graduated';

UPDATE `student_profile`
   SET `status` = 'inactive'
   WHERE `status` NOT IN ('active','completed','inactive');
