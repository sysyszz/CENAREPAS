import React from 'react';
import { motion } from 'framer-motion';
import { useConfiguracion } from '../../../shared/contexts/ConfiguracionContext';
import cenarepasLogo from '../../../assets/cenarepas-icon.svg';

export function SiteFooter() {
  const { nombreProyecto } = useConfiguracion();

  return (
    <footer className="relative py-10 sm:py-12 bg-[#fffbf0] text-slate-700 border-t border-[#e8dcc0]">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >

        {/* Logo */}
        <motion.a href="/" whileHover={{ scale: 1.02 }} className="flex items-center gap-2.5 shrink-0">
          <img
            src={cenarepasLogo}
            alt={nombreProyecto || 'CENAREPAS'}
            className="h-8 sm:h-9 w-8 sm:w-9 object-contain rounded-lg drop-shadow-sm"
          />
          <div className="flex flex-col leading-none">
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              {nombreProyecto || 'CENAREPAS'}
            </span>
            <span className="text-[9px] font-bold tracking-[0.16em] uppercase text-slate-500 mt-0.5">
              FÁBRICA DE AREPAS
            </span>
          </div>
        </motion.a>

        {/* Derechos Reservados */}
        <p className="text-slate-500 text-xs sm:text-sm font-normal text-center md:text-left">
          © {new Date().getFullYear()} {nombreProyecto || 'CENAREPAS'} · Todos los derechos reservados.
        </p>

        {/* Redes Sociales */}
        <div className="flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
          <motion.a whileHover={{ y: -1, color: '#c1502d' }} href="#" className="hover:text-brand transition-colors">
            Instagram
          </motion.a>
          <motion.a whileHover={{ y: -1, color: '#c1502d' }} href="#" className="hover:text-brand transition-colors">
            Facebook
          </motion.a>
        </div>

      </motion.div>
    </footer>
  );
}


