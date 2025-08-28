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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signUp } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const action = isSignUp ? signUp : login;
    const { error } = await action(email, password);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else if (isSignUp) {
      toast({
        title: "Revisa tu email",
        description: "Se ha enviado un enlace de confirmación a tu correo electrónico.",
      });
      setIsSignUp(false); // Switch back to login view
    }
    // On successful login, the onAuthStateChange listener in AuthContext will handle it.

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen hotel-gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract geometric elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-hotel-red/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-hotel-navy/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-hotel-red/5 via-transparent to-hotel-navy/5 rounded-full blur-3xl"></div>
      </div>
      <div className="w-full max-w-md space-y-6">
        {/* Language Selector */}
        <div className="flex justify-center relative z-10">
          <Select value={language} onValueChange={(value: 'es' | 'pt') => setLanguage(value)}>
            <SelectTrigger className="w-32 bg-black/20 border-white/10 text-white backdrop-blur-md hover:bg-black/30 transition-all">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 backdrop-blur-md">
              <SelectItem value="es" className="text-white hover:bg-white/10">Español</SelectItem>
              <SelectItem value="pt" className="text-white hover:bg-white/10">Português</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Login Card */}
        <Card className="hotel-card border-white/10 backdrop-blur-xl bg-black/40 shadow-2xl relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-hotel-red to-hotel-navy rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/10">
              <Hotel className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-hotel-red to-hotel-navy bg-clip-text text-transparent">
                {t('hotel.name')}
              </CardTitle>
              <CardDescription className="text-black/70 mt-2">
                {t('login.subtitle')}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/75 backdrop-blur-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">{t('login.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('login.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/75 backdrop-blur-sm"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-hotel-red to-hotel-navy hover:from-hotel-red-dark hover:to-hotel-navy-dark text-white font-semibold"
                disabled={isLoading}
              >
                <Lock className="w-4 h-4 mr-2" />
                {isLoading
                  ? 'Processando...'
                  : (isSignUp ? 'Cadastrar' : t('login.button'))
                }
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-white/80">
                {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
              </span>
              <Button
                variant="link"
                className="text-hotel-red font-bold"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Entrar' : 'Cadastre-se'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;