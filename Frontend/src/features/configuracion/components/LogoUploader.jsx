import { useRef } from 'react';
import { Upload, RotateCcw, Image as ImageIcon, Sparkles } from 'lucide-react';
import defaultLogo from '../../../assets/logo-icon.png';

export function LogoUploader({ logoUrl, onChangeLogo, onResetLogo }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChangeLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isCustomLogo = Boolean(logoUrl && logoUrl !== defaultLogo);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-card border border-border">
        {/* Previews en fondo claro y oscuro */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Fondo Claro</span>
            <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 p-2.5 flex items-center justify-center shadow-xs">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Vista previa Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-300" />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Fondo Oscuro</span>
            <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-800 p-2.5 flex items-center justify-center shadow-xs">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Vista previa Logo Oscuro"
                  className="w-full h-full object-contain"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-600" />
              )}
            </div>
          </div>
        </div>

        {/* Upload Controls */}
        <div className="space-y-2 flex-1 text-center sm:text-left">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-primary" />
            Logotipo Institucional
          </h4>
          <p className="text-xs text-muted-foreground">
            Sube el isotipo o logotipo de la empresa en formato PNG, SVG, JPG o WebP con fondo transparente. Tamaño recomendado: 512x512px.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Subir nuevo logo
            </button>

            {isCustomLogo && (
              <button
                type="button"
                onClick={onResetLogo}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium rounded-lg transition-colors cursor-pointer"
                title="Restaurar logo predeterminado"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restaurar original
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
