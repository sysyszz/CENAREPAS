import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Lock, Mail } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de login
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8FAFC' }}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#2563EB' }}
            >
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl" style={{ color: '#0F172A' }}>
            Sistema Administrativo
          </CardTitle>
          <CardDescription style={{ color: '#64748B' }}>
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#64748B' }} />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#64748B' }} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-sm hover:underline"
                style={{ color: '#2563EB' }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full text-white"
              style={{ backgroundColor: '#2563EB' }}
            >
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
