import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { COMPROBANTE_MAX_BYTES, COMPROBANTE_MIME } from '../config/negocio.js';
import { badRequest, forbidden } from '../utils/httpError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Los comprobantes de pago NO van en /uploads (que se sirve sin sesión):
 * se guardan aparte y solo se descargan por GET /api/v1/comprobantes/:archivo
 * con autenticación (ver comprobantes.routes.js).
 */
export const COMPROBANTES_DIR = path.join(__dirname, '../../comprobantes');
if (!fs.existsSync(COMPROBANTES_DIR)) {
  fs.mkdirSync(COMPROBANTES_DIR, { recursive: true });
}

const EXTENSION = { 'image/jpeg': '.jpg', 'image/png': '.png', 'application/pdf': '.pdf' };

// Firmas de archivo: el contenido debe coincidir con el tipo declarado.
const FIRMAS = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
};

// El nombre lleva el id del usuario que lo sube: así se valida quién puede adjuntarlo.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, COMPROBANTES_DIR),
  filename: (req, file, cb) => {
    const aleatorio = crypto.randomBytes(12).toString('hex');
    cb(null, `u${req.user.id_usuario}_${Date.now()}_${aleatorio}${EXTENSION[file.mimetype]}`);
  },
});

export const uploadComprobante = multer({
  storage,
  limits: { fileSize: COMPROBANTE_MAX_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (COMPROBANTE_MIME.includes(file.mimetype)) return cb(null, true);
    return cb(badRequest('El comprobante debe ser JPG, PNG o PDF'), false);
  },
});

/** Revisa la firma del archivo ya guardado; si no coincide, lo borra y falla. */
export const verificarFirma = (file) => {
  const firma = FIRMAS[file.mimetype];
  const fd = fs.openSync(file.path, 'r');
  const cabecera = Buffer.alloc(firma.length);
  fs.readSync(fd, cabecera, 0, firma.length, 0);
  fs.closeSync(fd);
  if (!firma.every((byte, i) => cabecera[i] === byte)) {
    fs.unlinkSync(file.path);
    throw badRequest('El archivo no es un JPG, PNG o PDF válido');
  }
};

const RUTA_PUBLICA = '/api/v1/comprobantes/';
const NOMBRE_VALIDO = /^u(\d+)_\d+_[0-9a-f]{24}\.(jpg|png|pdf)$/;

export const urlComprobante = (archivo) => `${RUTA_PUBLICA}${archivo}`;

/**
 * Valida la URL de comprobante que llega al crear un pedido o un abono:
 * debe ser un archivo subido por este mismo usuario y existir en disco.
 * Devuelve la URL normalizada o null si no se envió.
 */
export const validarComprobanteDelUsuario = (url, idUsuario) => {
  if (url === undefined || url === null || url === '') return null;
  const archivo = String(url).split('/').pop();
  const match = NOMBRE_VALIDO.exec(archivo);
  if (!match) throw badRequest('Comprobante inválido');
  if (Number(match[1]) !== Number(idUsuario)) throw forbidden('El comprobante no pertenece a tu cuenta');
  if (!fs.existsSync(path.join(COMPROBANTES_DIR, archivo))) throw badRequest('El comprobante no existe; súbelo de nuevo');
  return urlComprobante(archivo);
};

export const archivoComprobante = (archivo) => {
  const match = NOMBRE_VALIDO.exec(archivo || '');
  if (!match) return null;
  return { ruta: path.join(COMPROBANTES_DIR, archivo), idUsuario: Number(match[1]) };
};
