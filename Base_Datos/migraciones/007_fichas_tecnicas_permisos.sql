-- 007 · Migración de permisos para Fichas Técnicas
-- Agrega el permiso 'fichas-tecnicas:ver' y lo asigna explícitamente
-- en la tabla rol_permiso tanto al rol 'Administrador' como al rol 'Secretaria'.
-- Idempotente. Bloqueada fuera de cenarepas_staging.
BEGIN;

DO $$
BEGIN
  IF current_database() <> 'cenarepas_staging' THEN
    RAISE EXCEPTION 'Migración bloqueada: solo se aplica en cenarepas_staging (base actual: %)', current_database();
  END IF;
END $$;

SET search_path TO cenarepas;

-- 1. Insertar el permiso fichas-tecnicas:ver si no existe
INSERT INTO permiso (modulo, accion, estado)
VALUES ('fichas-tecnicas', 'ver', 'Activo')
ON CONFLICT (modulo, accion) DO NOTHING;

-- 2. Asignar explícitamente a Administrador y Secretaria (y Vendedor)
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r
JOIN permiso p ON p.modulo = 'fichas-tecnicas' AND p.accion = 'ver'
WHERE r.nombre IN ('Administrador', 'Secretaria', 'Vendedor')
  AND NOT EXISTS (
    SELECT 1 FROM rol_permiso rp WHERE rp.id_rol = r.id_rol AND rp.id_permiso = p.id_permiso
  );

COMMIT;

-- 3. Consulta de verificación que devuelve ambos roles vinculados al permiso
SELECT r.nombre AS rol, p.modulo, p.accion
FROM cenarepas.rol_permiso rp
JOIN cenarepas.rol r ON r.id_rol = rp.id_rol
JOIN cenarepas.permiso p ON p.id_permiso = rp.id_permiso
WHERE p.modulo = 'fichas-tecnicas' AND p.accion = 'ver'
  AND r.nombre IN ('Administrador', 'Secretaria')
ORDER BY r.nombre;