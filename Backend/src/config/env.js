import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT.trim(), 10) : 4000,
  nodeEnv: process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development',
  frontendUrl: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST ? process.env.DB_HOST.trim() : 'localhost',
    port: parseInt(process.env.DB_PORT ? process.env.DB_PORT.trim() : '5432', 10),
    user: process.env.DB_USER ? process.env.DB_USER.trim() : 'postgres',
    password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD.trim() : 'postgres',
    database: process.env.DB_NAME ? process.env.DB_NAME.trim() : 'cenarepas_db',
    schema: process.env.DB_SCHEMA ? process.env.DB_SCHEMA.trim() : 'cenarepas',
  },
  jwt: {
    secret: process.env.JWT_SECRET ? process.env.JWT_SECRET.trim() : 'cenarepas_super_secret_jwt_key_2026_masarepas',
    expiresIn: process.env.JWT_EXPIRES_IN ? process.env.JWT_EXPIRES_IN.trim() : '24h',
  },
};

export const env = config;
export default config;
