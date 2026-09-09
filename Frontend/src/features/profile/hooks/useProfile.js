import { useState, useEffect } from 'react';
import { getProfile, updateProfile, changePassword, getActiveSessions } from '../services/profileService';
import { toast } from '../../../shared/utils/toast';

export function useProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    cargo: '',
    fechaCreacion: '',
    ultimoAcceso: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getProfile().then(data => setProfileData(data));
    getActiveSessions().then(data => setSessions(data));
  }, []);

  const handleSaveProfile = async () => {
    try {
      setIsEditing(false);
      await updateProfile(profileData);
      toast.success('Perfil actualizado');
    } catch {
      toast.error('No se pudo actualizar el perfil');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    try {
      await changePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Contraseña actualizada');
    } catch {
      toast.error('No se pudo actualizar la contraseña');
    }
  };

  return {
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    profileData,
    setProfileData,
    passwordData,
    setPasswordData,
    sessions,
    handleSaveProfile,
    handleChangePassword,
  };
}
