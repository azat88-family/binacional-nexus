import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'pt';

interface Translations {
  es: Record<string, string>;
  pt: Record<string, string>;
}

const translations: Translations = {
  es: {
    // Login & Auth
    'hotel.name': 'Hotel Bi Nacional',
    'login.title': 'Acceso al Sistema',
    'login.subtitle': 'Sistema de Gestión Hotelera',
    'login.username': 'Usuario',
    'login.password': 'Contraseña',
    'login.owner': 'Propietario',
    'login.attendant': 'Recepcionista',
    'login.button': 'Iniciar Sesión',
    
    // Sidebar
    'sidebar.dashboard': 'Panel de Control',
    'sidebar.rooms': 'Habitaciones',
    'sidebar.reservations': 'Reservas',
    'sidebar.maintenance': 'Mantenimiento',
    'sidebar.cleaning': 'Limpieza',
    'sidebar.currencies': 'Cotizaciones',
    
    // Dashboard
    'dashboard.title': 'Panel de Control - Hotel Bi Nacional',
    'dashboard.daily.income': 'Ingresos Diarios',
    'dashboard.weekly.income': 'Ingresos Semanales',
    'dashboard.monthly.income': 'Ingresos Mensuales',
    'dashboard.yearly.income': 'Ingresos Anuales',
    'dashboard.occupancy': 'Ocupación',
    'dashboard.maintenance.pending': 'Mantenimientos Pendientes',
    'dashboard.cleaning.pending': 'Limpiezas Pendientes',
    'dashboard.total.rooms': 'Total Habitaciones',
    'dashboard.available.rooms': 'Habitaciones Disponibles',
    'dashboard.occupied.rooms': 'Habitaciones Ocupadas',
    
    // Rooms
    'rooms.title': 'Gestión de Habitaciones',
    'rooms.checkin': 'Check-in',
    'rooms.checkout': 'Check-out',
    'rooms.invoice': 'Factura',
    'rooms.available': 'Disponible',
    'rooms.occupied': 'Ocupada',
    'rooms.maintenance': 'Mantenimiento',
    'rooms.cleaning': 'Limpieza',
    
    // Currency
    'currency.title': 'Cotizaciones',
    'currency.usd': 'Dólar Estadounidense',
    'currency.brl': 'Real Brasileño',
    'currency.pyg': 'Guaraní Paraguayo',
    'currency.cad': 'Dólar Canadiense',
    'currency.eur': 'Euro',
    
    // Forms
    'form.guest.photo': 'Foto del Huésped',
    'form.full.name': 'Nombre Completo',
    'form.address': 'Dirección',
    'form.city': 'Ciudad',
    'form.state': 'Departamento',
    'form.country': 'País',
    'form.document.number': 'Número de Documento',
    'form.email': 'Email',
    'form.phone': 'Teléfono',
    'form.companions': 'Acompañantes',
    'form.payment.method': 'Forma de Pago',
    'form.save': 'Guardar',
    'form.cancel': 'Cancelar',
    
    // Payment methods
    'payment.cash': 'Efectivo',
    'payment.pix': 'PIX',
    'payment.card': 'Tarjeta',
    
    // Status
    'status.welcome': 'Bienvenido',
    'status.logout': 'Cerrar Sesión',
  },
  pt: {
    // Login & Auth
    'hotel.name': 'Hotel Bi Nacional',
    'login.title': 'Acesso ao Sistema',
    'login.subtitle': 'Sistema de Gestão Hoteleira',
    'login.username': 'Usuário',
    'login.password': 'Senha',
    'login.owner': 'Proprietário',
    'login.attendant': 'Atendente',
    'login.button': 'Entrar',
    
    // Sidebar
    'sidebar.dashboard': 'Painel de Controle',
    'sidebar.rooms': 'Quartos',
    'sidebar.reservations': 'Reservas',
    'sidebar.maintenance': 'Manutenção',
    'sidebar.cleaning': 'Limpeza',
    'sidebar.currencies': 'Cotações',
    
    // Dashboard
    'dashboard.title': 'Painel de Controle - Hotel Bi Nacional',
    'dashboard.daily.income': 'Receita Diária',
    'dashboard.weekly.income': 'Receita Semanal',
    'dashboard.monthly.income': 'Receita Mensal',
    'dashboard.yearly.income': 'Receita Anual',
    'dashboard.occupancy': 'Ocupação',
    'dashboard.maintenance.pending': 'Manutenções Pendentes',
    'dashboard.cleaning.pending': 'Limpezas Pendentes',
    'dashboard.total.rooms': 'Total de Quartos',
    'dashboard.available.rooms': 'Quartos Disponíveis',
    'dashboard.occupied.rooms': 'Quartos Ocupados',
    
    // Rooms
    'rooms.title': 'Gestão de Quartos',
    'rooms.checkin': 'Check-in',
    'rooms.checkout': 'Check-out',
    'rooms.invoice': 'Nota Fiscal',
    'rooms.available': 'Disponível',
    'rooms.occupied': 'Ocupado',
    'rooms.maintenance': 'Manutenção',
    'rooms.cleaning': 'Limpeza',
    
    // Currency
    'currency.title': 'Cotações',
    'currency.usd': 'Dólar Americano',
    'currency.brl': 'Real Brasileiro',
    'currency.pyg': 'Guarani Paraguaio',
    'currency.cad': 'Dólar Canadense',
    'currency.eur': 'Euro',
    
    // Forms
    'form.guest.photo': 'Foto do Hóspede',
    'form.full.name': 'Nome Completo',
    'form.address': 'Endereço',
    'form.city': 'Cidade',
    'form.state': 'Estado',
    'form.country': 'País',
    'form.document.number': 'Número do Documento',
    'form.email': 'Email',
    'form.phone': 'Telefone',
    'form.companions': 'Acompanhantes',
    'form.payment.method': 'Forma de Pagamento',
    'form.save': 'Salvar',
    'form.cancel': 'Cancelar',
    
    // Payment methods
    'payment.cash': 'Dinheiro',
    'payment.pix': 'PIX',
    'payment.card': 'Cartão',
    
    // Status
    'status.welcome': 'Bem-vindo',
    'status.logout': 'Sair',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};