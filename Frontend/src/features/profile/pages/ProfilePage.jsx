import { useProfile } from '../hooks/useProfile';
import { ProfilePersonalForm } from '../components/ProfilePersonalForm';
import { ProfileSecurityTab } from '../components/ProfileSecurityTab';
import Toast from '../../../shared/components/Toast';

export default function ProfilePage() {
  const {
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
  } = useProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal y seguridad</p>
      </div>

      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 border-b-2 transition-colors font-medium ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Mi Perfil
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 border-b-2 transition-colors font-medium ${
            activeTab === 'security'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Seguridad
        </button>
      </div>

      {activeTab === 'profile' && (
        <ProfilePersonalForm
          profileData={profileData}
          setProfileData={setProfileData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSaveProfile={handleSaveProfile}
        />
      )}

      {activeTab === 'security' && (
        <ProfileSecurityTab
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          handleChangePassword={handleChangePassword}
          sessions={sessions}
        />
      )}

      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}
