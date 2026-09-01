import { useState } from 'react';
import {
  Building2,
  Sliders,
  Save,
  RotateCcw,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Home,
  Check,
} from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import Toast from '../../../shared/components/Toast';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import { useConfiguracionPage } from '../hooks/useConfiguracionPage';
import { LogoUploader } from '../components/LogoUploader';
import { BannerManager } from '../components/BannerManager';
import defaultLogo from '../../../assets/logo-icon.png';

export default function ConfiguracionPage() {
  const {
    formData,
    handleChange,
    handleAddBannerImage,
    handleRemoveBannerImage,
    handleReorderBannerImages,
    handleSave,
    handleReset,
    isSaving,
    showResetDialog,
    setShowResetDialog,
    toast,
    setToast,
  } = useConfiguracionPage();

  const [newSedeInput, setNewSedeInput] = useState('');
  const [showAddSede, setShowAddSede] = useState(false);

  const handleAddSede = () => {
    if (!newSedeInput.trim()) return;
    const clean = newSedeInput.trim();
    if (!formData.sedesDisponibles.includes(clean)) {
      const updated = [...formData.sedesDisponibles, clean];
      handleChange('sedesDisponibles', updated);
      handleChange('sede', clean);
    }
    setNewSedeInput('');
    setShowAddSede(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Configuración del Sistema"
        subtitle="Personaliza la identidad de la marca, logotipo oficial, sede activa y banners de la fábrica"
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Bloque 1: Identidad Corporativa */}
        <section className="bg-card p-6 rounded-xl border border-border shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Identidad de la Marca</h3>
              <p className="text-xs text-muted-foreground">
                Define el nombre comercial que se reflejará en todo el sistema y la página web.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-xs font-semibold text-foreground uppercase tracking-wider">
                Nombre del Proyecto / Marca *
              </label>
              <input
                type="text"
                required
                maxLength={60}
                value={formData.nombreProyecto}
                onChange={(e) => handleChange('nombreProyecto', e.target.value)}
                placeholder="Ej. CENAREPAS / Masarepas"
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Este nombre reemplaza el texto fijo del Sidebar, Header y Landing Page.
              </span>
            </div>

            <div>
              <label className="block mb-2 text-xs font-semibold text-foreground uppercase tracking-wider">
                Eslogan / Subtítulo Institucional
              </label>
              <input
                type="text"
                maxLength={100}
                value={formData.eslogan}
                onChange={(e) => handleChange('eslogan', e.target.value)}
                placeholder="Ej. Fábrica de Arepas Frescas y Tradicionales"
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          {/* Sede Activa */}
          <div className="pt-2 border-t border-border/60">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block mb-2 text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Sede Predeterminada
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.sede}
                    onChange={(e) => handleChange('sede', e.target.value)}
                    className="flex-1 px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  >
                    {formData.sedesDisponibles.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddSede(!showAddSede)}
                    className="px-3 py-2 border border-border bg-background hover:bg-muted text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Añadir nueva sede"
                  >
                    + Nueva Sede
                  </button>
                </div>
              </div>

              {showAddSede && (
                <div className="p-3 bg-muted/40 rounded-lg border border-border/80 space-y-2 animate-in fade-in-50">
                  <label className="block text-xs font-medium">Nombre de la nueva sede</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej. Sede Norte Chapinero"
                      value={newSedeInput}
                      onChange={(e) => setNewSedeInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-input bg-input-background rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={handleAddSede}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:opacity-90"
                    >
                      Guardar Sede
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bloque 2: Logotipo */}
        <section className="bg-card p-6 rounded-xl border border-border shadow-xs space-y-5">
          <LogoUploader
            logoUrl={formData.logoUrl}
            onChangeLogo={(newLogo) => handleChange('logoUrl', newLogo)}
            onResetLogo={() => handleChange('logoUrl', defaultLogo)}
          />
        </section>

        {/* Bloque 3: Banners de la Landing */}
        <section className="bg-card p-6 rounded-xl border border-border shadow-xs space-y-5">
          <BannerManager
            bannerImages={formData.bannerImages}
            onAddImage={handleAddBannerImage}
            onRemoveImage={handleRemoveBannerImage}
            onReorderImages={handleReorderBannerImages}
          />
        </section>

        {/* Bloque 4: Información de Contacto */}
        <section className="bg-card p-6 rounded-xl border border-border shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Datos de Contacto del Portal</h3>
              <p className="text-xs text-muted-foreground">
                Información mostrada en el encabezado y pie de página de la Landing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                Teléfono de Contacto
              </label>
              <input
                type="text"
                value={formData.telefonoContacto}
                onChange={(e) => handleChange('telefonoContacto', e.target.value)}
                placeholder="+57 (608) 261-0000"
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.correoContacto}
                onChange={(e) => handleChange('correoContacto', e.target.value)}
                placeholder="contacto@cenarepas.com"
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-muted-foreground" />
                Dirección Principal
              </label>
              <input
                type="text"
                value={formData.direccionContacto}
                onChange={(e) => handleChange('direccionContacto', e.target.value)}
                placeholder="Calle 10 # 4-50, Ibagué"
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </section>

        {/* Barra de Acciones Fija / Inferior */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border shadow-md">
          <button
            type="button"
            onClick={() => setShowResetDialog(true)}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer Valores por Defecto
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando...' : 'Guardar Todos los Cambios'}
          </button>
        </div>
      </form>

      {/* Diálogo de Confirmación para Restablecer */}
      <ConfirmDialog
        isOpen={showResetDialog}
        title="Restablecer Configuración"
        message="¿Estás seguro de que deseas restablecer todos los valores a la configuración predeterminada de fábrica? Se perderán las imágenes personalizadas y cambios del nombre."
        confirmText="Restablecer"
        onConfirm={handleReset}
        onCancel={() => setShowResetDialog(false)}
        isLoading={isSaving}
      />

      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}
