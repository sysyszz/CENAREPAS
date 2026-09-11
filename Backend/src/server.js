import app from './app.js';
import { env } from './config/env.js';
import { checkDbConnection } from './config/db.js';

const PORT = env.PORT || 4000;

async function startServer() {
  console.log('==========================================');
  console.log('🚀 Iniciando Servidor CENAREPAS Backend...');
  console.log('==========================================');
  
  // Test connection to PostgreSQL
  const dbConnected = await checkDbConnection();
  if (!dbConnected) {
    console.warn('⚠️  El servidor correrá en modo resiliente. Cuando configures la base de datos PostgreSQL en el archivo .env, las consultas responderán directamente de la base de datos.');
  }

  app.listen(PORT, () => {
    console.log(`✅ Servidor CENAREPAS Backend escuchando en http://localhost:${PORT}`);
    console.log(`📡 API v1 disponible en http://localhost:${PORT}/api/v1`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/v1/health`);
    console.log('==========================================\n');
  });
}

startServer();
