import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'eduvertex',
    multipleStatements: true
  });
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const sql = fs.readFileSync(path.join(__dirname, 'migrations', '013_normalize_photo_paths.sql'), 'utf8');
  try {
    await conn.query(sql);
    console.log('migration ran');
  } catch (e) {
    console.error('migration error', e.message);
  }
  await conn.end();
})();