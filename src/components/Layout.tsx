import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppSidebar } from '@/components/AppSidebar';
import { Languages, LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b bg-gradient-to-r from-hotel-red/5 to-hotel-navy/5 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-hotel-navy hover:text-hotel-red transition-colors" />
              <h1 className="font-semibold text-lg bg-gradient-to-r from-hotel-red to-hotel-navy bg-clip-text text-transparent">
                {t('hotel.name')}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <Select value={language} onValueChange={(value: 'es' | 'pt') => setLanguage(value)}>
                <SelectTrigger className="w-32">
                  <Languages className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>

              {/* User Info */}
              <div className="flex items-center gap-2 text-sm text-foreground">
                <User className="w-4 h-4" />
                <span>{t('status.welcome')}, {user?.email}</span>
              </div>

              {/* Logout */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('status.logout')}
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;