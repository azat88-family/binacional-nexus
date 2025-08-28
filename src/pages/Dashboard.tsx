import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Bed, 
  Users, 
  Calendar,
  TrendingUp,
  Wrench,
  Sparkles,
  BedDouble
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Mock data - in a real app, this would come from an API
  const dashboardData = {
    dailyIncome: 2850000, // Guaranis
    weeklyIncome: 19950000,
    monthlyIncome: 85600000,
    yearlyIncome: 1027200000,
    occupancy: 68,
    totalRooms: 100,
    occupiedRooms: 68,
    availableRooms: 25,
    maintenanceRooms: 4,
    cleaningRooms: 3,
    pendingMaintenance: 7,
    pendingCleaning: 12,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    description?: string;
    trend?: number;
    showForOwnerOnly?: boolean;
  }> = ({ title, value, icon: Icon, description, trend, showForOwnerOnly = false }) => {
    // For now, show all metrics since role system is not implemented yet
    // if (showForOwnerOnly && user?.role !== 'owner') {
    //   return null;
    // }

    return (
      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-hotel-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-xs ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
              <TrendingUp className={`w-3 h-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
              {trend >= 0 ? '+' : ''}{trend}% vs mes anterior
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-hotel-red to-hotel-navy bg-clip-text text-transparent">
            {t('dashboard.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Sistema de gestión hotelera
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Última actualización</div>
          <div className="text-sm font-medium">{new Date().toLocaleString('es-PY')}</div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t('dashboard.daily.income')}
            value={formatCurrency(dashboardData.dailyIncome)}
            icon={DollarSign}
            trend={12.5}
            showForOwnerOnly
          />
          <MetricCard
            title={t('dashboard.weekly.income')}
            value={formatCurrency(dashboardData.weeklyIncome)}
            icon={Calendar}
            trend={8.2}
            showForOwnerOnly
          />
          <MetricCard
            title={t('dashboard.monthly.income')}
            value={formatCurrency(dashboardData.monthlyIncome)}
            icon={TrendingUp}
            trend={15.1}
            showForOwnerOnly
          />
          <MetricCard
            title={t('dashboard.yearly.income')}
            value={formatCurrency(dashboardData.yearlyIncome)}
            icon={TrendingUp}
            trend={22.3}
            showForOwnerOnly
          />
        </div>

      {/* Room Status - All Users */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('dashboard.total.rooms')}
          value={dashboardData.totalRooms}
          icon={BedDouble}
          description="Habitaciones del hotel"
        />
        <MetricCard
          title={t('dashboard.occupied.rooms')}
          value={dashboardData.occupiedRooms}
          icon={Bed}
          description="Huéspedes registrados"
        />
        <MetricCard
          title={t('dashboard.available.rooms')}
          value={dashboardData.availableRooms}
          icon={Users}
          description="Listas para ocupar"
        />
        <MetricCard
          title={t('dashboard.occupancy')}
          value={`${dashboardData.occupancy}%`}
          icon={TrendingUp}
          description="Ocupación actual"
        />
      </div>

      {/* Operational Status */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Occupancy Progress */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-hotel-red" />
              Estado de Ocupación
            </CardTitle>
            <CardDescription>
              Distribución actual de habitaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ocupadas</span>
                <span>{dashboardData.occupiedRooms}/100</span>
              </div>
              <Progress value={dashboardData.occupancy} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-hotel-red to-hotel-red-light rounded-full"></div>
                  <span className="text-xs">Ocupadas: {dashboardData.occupiedRooms}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-success to-green-400 rounded-full"></div>
                  <span className="text-xs">Disponibles: {dashboardData.availableRooms}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-warning to-yellow-400 rounded-full"></div>
                  <span className="text-xs">Mantenimiento: {dashboardData.maintenanceRooms}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-hotel-navy to-hotel-navy-light rounded-full"></div>
                  <span className="text-xs">Limpieza: {dashboardData.cleaningRooms}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-hotel-red" />
              Tareas Pendientes
            </CardTitle>
            <CardDescription>
              Actividades por completar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Wrench className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">
                  {t('dashboard.maintenance.pending')}
                </span>
              </div>
              <span className="text-lg font-bold text-warning">
                {dashboardData.pendingMaintenance}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-hotel-navy" />
                <span className="text-sm font-medium">
                  {t('dashboard.cleaning.pending')}
                </span>
              </div>
              <span className="text-lg font-bold text-hotel-navy">
                {dashboardData.pendingCleaning}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;