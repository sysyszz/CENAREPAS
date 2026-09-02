import { useRef, useState } from 'react';
import { Upload, ArrowUp, ArrowDown, Trash2, Plus, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export function BannerManager({ bannerImages, onAddImage, onRemoveImage, onReorderImages }) {
  const fileInputRef = useRef(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [urlTitleValue, setUrlTitleValue] = useState('');

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        alert(`La imagen "${file.name}" supera los 8MB`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onAddImage({
          url: reader.result,
          titulo: file.name.replace(/\.[^/.]+$/, ''),
          subtitulo: 'Imagen de banner cargada',
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInputValue.trim()) return;
    onAddImage({
      url: urlInputValue.trim(),
      titulo: urlTitleValue.trim() || 'Banner promocional',
      subtitulo: '',
    });
    setUrlInputValue('');
    setUrlTitleValue('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Imágenes del Banner (Landing Page)
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Estas imágenes se mostrarán de forma dinámica en la página principal. Puedes reordenarlas o añadir nuevas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Subir del ordenador
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-background hover:bg-muted text-foreground text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
            Por URL
          </button>
        </div>
      </div>

      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="p-3.5 rounded-lg bg-muted/40 border border-border/80 space-y-3 animate-in fade-in-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">URL de la imagen *</label>
              <input
                type="url"
                required
                placeholder="https://ejemplo.com/arepas-banner.jpg"
                value={urlInputValue}
                onChange={(e) => setUrlInputValue(e.target.value)}
                className="w-full px-3 py-1.5 border border-input bg-input-background rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Título del banner (opcional)</label>
              <input
                type="text"
                placeholder="Ej. Arepas de Chócolo recién hechas"
                value={urlTitleValue}
                onChange={(e) => setUrlTitleValue(e.target.value)}
                className="w-full px-3 py-1.5 border border-input bg-input-background rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="px-3 py-1 text-xs border border-border rounded-md hover:bg-muted font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs bg-primary text-primary-foreground font-semibold rounded-md hover:opacity-90 transition-opacity"
            >
              Agregar Banner
            </button>
          </div>
        </form>
      )}

      {/* Lista de banners con reordenamiento */}
      {bannerImages.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-border bg-muted/20">
          <ImageIcon className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">No hay imágenes de banner configuradas.</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Subir la primera imagen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bannerImages.map((banner, index) => {
            const isFirst = index === 0;
            const isLast = index === bannerImages.length - 1;

            return (
              <div
                key={banner.id || index}
                className="group relative flex flex-col rounded-xl overflow-hidden border border-border bg-card shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                {/* Visual Header / Order Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">
                    Slide #{index + 1} {isFirst && '(Principal)'}
                  </span>
                </div>

                {/* Controls Bar Overlay */}
                <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-black/75 backdrop-blur-xs p-1 rounded-lg shadow-xs">
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => onReorderImages(index, index - 1)}
                    className="p-1 text-white hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Mover antes"
                    aria-label="Mover imagen antes"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => onReorderImages(index, index + 1)}
                    className="p-1 text-white hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Mover después"
                    aria-label="Mover imagen después"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="p-1 text-destructive hover:bg-destructive/20 rounded transition-colors"
                    title="Eliminar banner"
                    aria-label="Eliminar banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Banner Thumbnail */}
                <div className="h-36 w-full bg-muted/40 overflow-hidden relative">
                  <img
                    src={banner.url}
                    alt={banner.titulo || `Banner ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Caption / Title */}
                <div className="p-3 text-xs space-y-1 bg-card">
                  <p className="font-semibold text-foreground truncate">
                    {banner.titulo || `Banner ${index + 1}`}
                  </p>
                  {banner.subtitulo && (
                    <p className="text-muted-foreground text-[11px] truncate">
                      {banner.subtitulo}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
