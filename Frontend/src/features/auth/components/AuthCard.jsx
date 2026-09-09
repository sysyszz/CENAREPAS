// components/AuthCard.jsx
import cenarepasLogoLight from '../../../assets/cenarepas-logo-light.svg';

export const AuthCard = ({ children }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100/60 p-4">
    <img src={cenarepasLogoLight} alt="CENAREPAS" className="mb-6 h-10 w-auto rounded-md" />
    <div className="w-full max-w-lg">
      {/* Contenedor con efecto de sombras múltiples escalonadas */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/40 rounded-3xl transform scale-[0.98] translate-y-3 shadow-sm border border-slate-200/50"></div>
        <div className="absolute inset-0 bg-white/70 rounded-3xl transform scale-[0.99] translate-y-1.5 shadow-md border border-slate-200/60"></div>

        {/* Tarjeta principal */}
        <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-10 backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  </div>
);