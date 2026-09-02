import { useState, useEffect } from 'react';
import { useConfiguracion } from '../../../shared/contexts/ConfiguracionContext';
import { saveConfiguracion, resetConfiguracion } from '../services/configuracionService';

export function useConfiguracionPage() {
  const {
    config,
    updateConfig,
    resetConfig: resetContextConfig,
    nombreProyecto,
    logoUrl,
    sede,
    sedesDisponibles,
    bannerImages,
  } = useConfiguracion();

  const [formData, setFormData] = useState({
    nombreProyecto: '',
    eslogan: '',
    logoUrl: '',
    sede: '',
    sedesDisponibles: [],
    bannerImages: [],
    telefonoContacto: '',
    correoContacto: '',
    direccionContacto: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    if (config) {
      setFormData({
        nombreProyecto: config.nombreProyecto || 'CENAREPAS',
        eslogan: config.eslogan || 'Fábrica de Arepas Frescas y Tradicionales',
        logoUrl: config.logoUrl || '',
        sede: config.sede || 'Sede Principal (Ibagué)',
        sedesDisponibles: config.sedesDisponibles || [
          'Sede Principal (Ibagué)',
          'Sede Espinal',
          'Sede Girardot',
        ],
        bannerImages: config.bannerImages || [],
        telefonoContacto: config.telefonoContacto || '',
        correoContacto: config.correoContacto || '',
        direccionContacto: config.direccionContacto || '',
      });
    }
  }, [config]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddBannerImage = (newImage) => {
    const item = typeof newImage === 'string'
      ? { id: `banner-${Date.now()}`, url: newImage, titulo: 'Nuevo Banner', subtitulo: '' }
      : { id: `banner-${Date.now()}`, ...newImage };

    setFormData((prev) => ({
      ...prev,
      bannerImages: [...prev.bannerImages, item],
    }));
  };

  const handleRemoveBannerImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      bannerImages: prev.bannerImages.filter((_, idx) => idx !== index),
    }));
  };

  const handleReorderBannerImages = (fromIndex, toIndex) => {
    setFormData((prev) => {
      const updated = [...prev.bannerImages];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return {
        ...prev,
        bannerImages: updated,
      };
    });
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);
    try {
      await saveConfiguracion(formData);
      updateConfig(formData);
      setToast({
        isOpen: true,
        type: 'success',
        message: 'Configuración guardada y aplicada exitosamente',
      });
    } catch (err) {
      setToast({
        isOpen: true,
        type: 'error',
        message: 'Error al guardar la configuración',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      await resetConfiguracion();
      resetContextConfig();
      setToast({
        isOpen: true,
        type: 'success',
        message: 'Configuración restablecida a los valores predeterminados',
      });
    } catch (err) {
      setToast({
        isOpen: true,
        type: 'error',
        message: 'Error al restablecer la configuración',
      });
    } finally {
      setIsSaving(false);
      setShowResetDialog(false);
    }
  };

  return {
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
  };
}
