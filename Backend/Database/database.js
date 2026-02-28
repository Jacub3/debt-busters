import { Pool } from 'pg';

// Statically typed connection configuration
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_password',
  port: 5432,
});

export default pool;