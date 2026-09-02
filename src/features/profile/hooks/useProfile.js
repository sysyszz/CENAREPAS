import { useState, useEffect } from 'react';
import { getProfile, updateProfile, changePassword, getActiveSessions } from '../services/profileService';

export function useProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

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
    setIsEditing(false);
    await updateProfile(profileData);
    setToast({ isOpen: true, type: 'success', message: 'Perfil actualizado correctamente' });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ isOpen: true, type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }
    await changePassword(passwordData);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setToast({ isOpen: true, type: 'success', message: 'Contraseña actualizada correctamente' });
  };

  return {
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    toast,
    setToast,
    profileData,
    setProfileData,
    passwordData,
    setPasswordData,
    sessions,
    handleSaveProfile,
    handleChangePassword,
  };
}
