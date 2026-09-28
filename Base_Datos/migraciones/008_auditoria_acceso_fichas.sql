-- 008 · Tabla de auditoría para acceso y consulta de Fichas Técnicas (Opción D)
-- Registra eventos de visualización y consulta de recetas industriales.
-- Idempotente. Bloqueada fuera de cenarepas_staging.
BEGIN;

DO $$
BEGIN
  IF current_database() <> 'cenarepas_staging' THEN
    RAISE EXCEPTION 'Migración bloqueada: solo se aplica en cenarepas_staging (base actual: %)', current_database();
  END IF;
END $$;

SET search_path TO cenarepas;

CREATE TABLE IF NOT EXISTS auditoria_acceso_fichas (
    id_auditoria_acceso SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES cenarepas.usuario(id_usuario) ON DELETE SET NULL,
    id_ficha INTEGER REFERENCES cenarepas.ficha_tecnica(id_ficha) ON DELETE CASCADE,
    ip_origen VARCHAR(45),
    user_agent TEXT,
    fecha_acceso TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    detalle TEXT
);

CREATE INDEX IF NOT EXISTS idx_auditoria_acceso_ficha ON cenarepas.auditoria_acceso_fichas (id_ficha);
CREATE INDEX IF NOT EXISTS idx_auditoria_acceso_usuario ON cenarepas.auditoria_acceso_fichas (id_usuario);
CREATE INDEX IF NOT EXISTS idx_auditoria_acceso_fecha ON cenarepas.auditoria_acceso_fichas (fecha_acceso DESC);

COMMIT;

-- Verificación de la estructura creada
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'cenarepas' AND table_name = 'auditoria_acceso_fichas'
ORDER BY ordinal_position;