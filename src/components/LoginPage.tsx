import React, { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages, Hotel, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import hotelLobby from '@/assets/hotel-lobby.jpg';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('owner');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password, role);
      if (!success) {
        toast({
          title: "Error de autenticación",
          description: "Usuario o contraseña incorrectos",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error durante el inicio de sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(220, 38, 38, 0.8), rgba(30, 58, 138, 0.8)), url(${hotelLobby})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Language Selector */}
        <div className="flex justify-center">
          <Select value={language} onValueChange={(value: 'es' | 'pt') => setLanguage(value)}>
            <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white backdrop-blur-sm">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Login Card */}
        <Card className="hotel-card border-white/20 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-hotel-red to-hotel-navy rounded-full flex items-center justify-center shadow-lg">
              <Hotel className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-hotel-red to-hotel-navy bg-clip-text text-transparent">
                {t('hotel.name')}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                {t('login.subtitle')}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Tipo de Usuario
                </Label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger>
                    <User className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">{t('login.owner')}</SelectItem>
                    <SelectItem value="attendant">{t('login.attendant')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">{t('login.username')}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t('login.username')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('login.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('login.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-hotel-red to-hotel-navy hover:from-hotel-red-dark hover:to-hotel-navy-dark text-white font-semibold"
                disabled={isLoading}
              >
                <Lock className="w-4 h-4 mr-2" />
                {isLoading ? 'Iniciando...' : t('login.button')}
              </Button>
            </form>

            {/* Demo credentials info */}
            <div className="mt-6 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
              <p className="font-semibold mb-1">Credenciales de prueba:</p>
              <p>Propietario: admin / admin123</p>
              <p>Recepcionista: recepcion / recepcion123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;