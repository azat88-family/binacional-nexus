import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { CurrencyWidget } from '@/components/CurrencyWidget';
import { 
  LayoutDashboard, 
  Bed, 
  Calendar, 
  Wrench, 
  Sparkles,
  Hotel
} from 'lucide-react';

const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: t('sidebar.dashboard'),
      url: '/dashboard',
      icon: LayoutDashboard,
      roles: ['owner', 'attendant'],
    },
    {
      title: t('sidebar.rooms'),
      url: '/rooms',
      icon: Bed,
      roles: ['owner', 'attendant'],
    },
    {
      title: t('sidebar.reservations'),
      url: '/reservations',
      icon: Calendar,
      roles: ['owner', 'attendant'],
    },
    {
      title: t('sidebar.maintenance'),
      url: '/maintenance',
      icon: Wrench,
      roles: ['owner', 'attendant'],
    },
    {
      title: t('sidebar.cleaning'),
      url: '/cleaning',
      icon: Sparkles,
      roles: ['owner', 'attendant'],
    },
  ];

  // For now, show all menu items since role system is not implemented yet
  const visibleItems = menuItems;

  return (
    <Sidebar className="w-64 transition-all duration-300">
      <SidebarContent className="bg-gradient-to-b from-hotel-navy to-hotel-navy-dark">
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-hotel-red to-white rounded-lg flex items-center justify-center">
              <Hotel className="w-5 h-5 text-hotel-navy" />
            </div>
            <div className="text-white">
              <div className="font-bold text-sm">Hotel</div>
              <div className="text-xs text-white/70">Bi Nacional</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70 text-xs uppercase tracking-wider px-4 py-2">
            Navegación
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-lg mx-2 transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-hotel-red to-hotel-red-light text-white shadow-lg' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Currency Widget */}
        <div className="mt-auto p-4">
          <CurrencyWidget />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export { AppSidebar };