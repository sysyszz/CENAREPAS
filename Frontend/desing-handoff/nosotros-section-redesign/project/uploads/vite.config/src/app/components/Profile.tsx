import { useState } from 'react';
import { User, Mail, Phone, Building, Calendar, Clock, Edit, Camera, Save, X, Lock, Monitor, LogOut } from 'lucide-react';
import Toast from './Toast';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ isOpen: boolean; type: 'success' | 'error'; message: string }>({ isOpen: false, type: 'success', message: '' });

  const [profileData, setProfileData] = useState({
    nombre: 'Administrador Sistema',
    email: 'admin@sistema.com',
    telefono: '+1 234-567-8900',
    cargo: 'Administrador General',
    fechaCreacion: '15 Enero 2024',
    ultimoAcceso: '3 Junio 2026 - 10:30 AM',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const sessions = [
    { id: 1, dispositivo: 'Chrome en Windows', ubicacion: 'New York, USA', fecha: 'Ahora', actual: true },
    { id: 2, dispositivo: 'Safari en iPhone', ubicacion: 'Los Angeles, USA', fecha: 'Hace 2 días', actual: false },
    { id: 3, dispositivo: 'Firefox en macOS', ubicacion: 'Miami, USA', fecha: 'Hace 5 días', actual: false },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    setToast({ isOpen: true, type: 'success', message: 'Perfil actualizado correctamente' });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ isOpen: true, type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setToast({ isOpen: true, type: 'success', message: 'Contraseña actualizada correctamente' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal y seguridad</p>
      </div>

      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Mi Perfil
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Seguridad
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                  <User className="w-16 h-16" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h3>{profileData.nombre}</h3>
              <p className="text-sm text-muted-foreground mb-4">{profileData.cargo}</p>
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                  >
                    <Edit className="w-4 h-4 inline mr-2" />
                    Editar Perfil
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted"
                    >
                      <X className="w-4 h-4 inline mr-2" />
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Guardar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="mb-6">Información Personal</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm">Nombre Completo</label>
                    <div className="flex items-center gap-2 px-4 py-2 border border-input bg-input-background rounded-lg">
                      <User className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.nombre}
                          onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                          className="flex-1 bg-transparent focus:outline-none"
                        />
                      ) : (
                        <span>{profileData.nombre}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Correo Electrónico</label>
                    <div className="flex items-center gap-2 px-4 py-2 border border-input bg-input-background rounded-lg">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="flex-1 bg-transparent focus:outline-none"
                        />
                      ) : (
                        <span>{profileData.email}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Teléfono</label>
                    <div className="flex items-center gap-2 px-4 py-2 border border-input bg-input-background rounded-lg">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.telefono}
                          onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                          className="flex-1 bg-transparent focus:outline-none"
                        />
                      ) : (
                        <span>{profileData.telefono}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Cargo</label>
                    <div className="flex items-center gap-2 px-4 py-2 border border-input bg-input-background rounded-lg">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.cargo}
                          onChange={(e) => setProfileData({ ...profileData, cargo: e.target.value })}
                          className="flex-1 bg-transparent focus:outline-none"
                        />
                      ) : (
                        <span>{profileData.cargo}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="mb-4">Información de Cuenta</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 border border-input bg-muted rounded-lg">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Fecha de Creación</p>
                        <p className="text-sm">{profileData.fechaCreacion}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 border border-input bg-muted rounded-lg">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Último Acceso</p>
                        <p className="text-sm">{profileData.ultimoAcceso}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h3>Cambiar Contraseña</h3>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm">Contraseña Actual</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Nueva Contraseña</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90"
              >
                Actualizar Contraseña
              </button>
            </form>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Monitor className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <h3>Sesiones Activas</h3>
                <p className="text-sm text-muted-foreground">Dispositivos con acceso a tu cuenta</p>
              </div>
            </div>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm">
                        {session.dispositivo}
                        {session.actual && <span className="ml-2 px-2 py-0.5 bg-success/10 text-success text-xs rounded">Actual</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{session.ubicacion} • {session.fecha}</p>
                    </div>
                  </div>
                  {!session.actual && (
                    <button className="p-2 hover:bg-muted rounded-lg text-destructive">
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10">
              Cerrar Todas las Sesiones
            </button>
          </div>
        </div>
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
