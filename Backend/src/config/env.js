import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'cenarepas_db',
    schema: process.env.DB_SCHEMA || 'cenarepas',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'cenarepas_super_secret_jwt_key_2026_masarepas',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
};

export const env = config;
export default config;
