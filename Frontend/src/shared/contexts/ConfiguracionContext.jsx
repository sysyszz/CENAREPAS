import { createContext, useContext, useState, useEffect } from 'react';
import defaultLogo from '../../assets/logo-icon.png';
import defaultBannerBasket from '../../features/landing/assets/arepas-basket.png';
import defaultBannerX10 from '../../features/landing/assets/arepas-x10.png';
import defaultBannerAmarillas from '../../features/landing/assets/arepas-amarillas-x5.png';

const STORAGE_KEY = 'cenarepas_configuracion';

export const DEFAULT_CONFIG = {
  nombreProyecto: 'CENAREPAS',
  eslogan: 'Fábrica de Arepas Frescas y Tradicionales',
  logoUrl: defaultLogo,
  sede: 'Sede Principal (Ibagué)',
  sedesDisponibles: [
    'Sede Principal (Ibagué)',
    'Sede Espinal',
    'Sede Girardot',
    'Planta de Producción Zona Industrial',
  ],
  bannerImages: [
    {
      id: 'banner-1',
      url: defaultBannerBasket,
      titulo: 'Arepas Tradicionales Frescas',
      subtitulo: 'Elaboradas diariamente con maíz 100% natural',
    },
    {
      id: 'banner-2',
      url: defaultBannerX10,
      titulo: 'Paquetes Institucionales y Familiares',
      subtitulo: 'Presentaciones x5, x10 y pedidos al por mayor',
    },
    {
      id: 'banner-3',
      url: defaultBannerAmarillas,
      titulo: 'Arepa Amarilla de Maíz Seleccionado',
      subtitulo: 'Sabor auténtico y textura inigualable',
    },
  ],
  telefonoContacto: '+57 (608) 261-0000',
  correoContacto: 'contacto@cenarepas.com',
  direccionContacto: 'Calle 10 # 4-50, Ibagué, Tolima',
};

const ConfiguracionContext = createContext(null);

export function ConfiguracionProvider({ children }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          bannerImages: Array.isArray(parsed.bannerImages) && parsed.bannerImages.length > 0
            ? parsed.bannerImages
            : DEFAULT_CONFIG.bannerImages,
        };
      }
    } catch (e) {
      console.error('Error al cargar configuración desde localStorage:', e);
    }
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Error al guardar configuración en localStorage:', e);
    }
  }, [config]);

  const updateConfig = (newValues) => {
    setConfig((prev) => ({
      ...prev,
      ...newValues,
    }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error al restablecer configuración:', e);
    }
  };

  const setNombreProyecto = (nombreProyecto) => {
    updateConfig({ nombreProyecto });
  };

  const setLogoUrl = (logoUrl) => {
    updateConfig({ logoUrl });
  };

  const setSede = (sede) => {
    updateConfig({ sede });
  };

  const setBannerImages = (bannerImages) => {
    updateConfig({ bannerImages });
  };

  const addBannerImage = (newImage) => {
    const item = typeof newImage === 'string'
      ? { id: `banner-${Date.now()}`, url: newImage, titulo: '', subtitulo: '' }
      : { id: `banner-${Date.now()}`, ...newImage };

    setConfig((prev) => ({
      ...prev,
      bannerImages: [...prev.bannerImages, item],
    }));
  };

  const removeBannerImage = (indexOrId) => {
    setConfig((prev) => ({
      ...prev,
      bannerImages: prev.bannerImages.filter((item, idx) =>
        typeof indexOrId === 'number' ? idx !== indexOrId : item.id !== indexOrId
      ),
    }));
  };

  const reorderBannerImages = (fromIndex, toIndex) => {
    setConfig((prev) => {
      if (
        fromIndex < 0 ||
        fromIndex >= prev.bannerImages.length ||
        toIndex < 0 ||
        toIndex >= prev.bannerImages.length
      ) {
        return prev;
      }
      const updated = [...prev.bannerImages];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return {
        ...prev,
        bannerImages: updated,
      };
    });
  };

  return (
    <ConfiguracionContext.Provider
      value={{
        config,
        nombreProyecto: config.nombreProyecto || DEFAULT_CONFIG.nombreProyecto,
        logoUrl: config.logoUrl || DEFAULT_CONFIG.logoUrl,
        sede: config.sede || DEFAULT_CONFIG.sede,
        sedesDisponibles: config.sedesDisponibles || DEFAULT_CONFIG.sedesDisponibles,
        bannerImages: config.bannerImages || DEFAULT_CONFIG.bannerImages,
        updateConfig,
        resetConfig,
        setNombreProyecto,
        setLogoUrl,
        setSede,
        setBannerImages,
        addBannerImage,
        removeBannerImage,
        reorderBannerImages,
      }}
    >
      {children}
    </ConfiguracionContext.Provider>
  );
}

export function useConfiguracion() {
  const context = useContext(ConfiguracionContext);
  if (!context) {
    throw new Error('useConfiguracion debe usarse dentro de un ConfiguracionProvider');
  }
  return context;
}
