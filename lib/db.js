import { Pool } from "pg";

const globalForPg = globalThis;

const pool =
  globalForPg.__pgPool ??
  new Pool({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT, 10),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  });

if (process.env.NODE_ENV !== "production") globalForPg.__pgPool = pool;
export default pool;
