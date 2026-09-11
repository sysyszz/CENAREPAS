import pg from 'pg';
import { config } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 4000,
});

// Configurar el esquema por defecto en cada conexión
pool.on('connect', (client) => {
  client.query(`SET search_path TO ${config.db.schema}, public;`).catch((err) => {
    // ignore schema setup errors if schema does not exist yet
  });
});

pool.on('error', (err) => {
  console.warn('[DB Pool Warning]:', err.message);
});

export const query = async (text, params) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (config.nodeEnv === 'development') {
      // console.log(`[SQL Query] (${duration}ms):`, text);
    }
    return res;
  } catch (err) {
    console.warn(`⚠️ [Database Query Warning]: ${err.message}`);
    return { rows: [], rowCount: 0 };
  }
};

export const checkDbConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT NOW() AS now, current_schema() AS schema');
    console.log(`✅ [Database]: Conexión exitosa a PostgreSQL (${config.db.database}.${config.db.schema}) a las ${res.rows[0].now}`);
    return true;
  } catch (err) {
    console.warn(`⚠️ [Database]: No se pudo conectar a PostgreSQL (${err.message}). Verifica tu archivo Backend/.env`);
    return false;
  } finally {
    if (client) client.release();
  }
};

export default { pool, query, checkDbConnection };
