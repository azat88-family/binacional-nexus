import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, AlertTriangle, CheckCircle } from 'lucide-react';

const Maintenance: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-hotel-red to-hotel-navy bg-clip-text text-transparent">
          {t('sidebar.maintenance')}
        </h1>
        <p className="text-muted-foreground mt-1">
          Control de mantenimiento de habitaciones
        </p>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-hotel-red" />
            Sistema de Mantenimiento
          </CardTitle>
          <CardDescription>
            Próximamente: Sistema completo de mantenimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="w-16 h-16 mx-auto mb-4 text-hotel-red/30" />
            <h3 className="text-lg font-semibold mb-2">En Desarrollo</h3>
            <p>El módulo de mantenimiento estará disponible próximamente con funcionalidades completas.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maintenance;