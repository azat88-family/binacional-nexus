import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, Clock, Phone, Mail, CreditCard, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reservation {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'checked-out';
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  notes?: string;
  createdAt: string;
}

const Reservations: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: '1',
      guestName: 'Carlos Mendoza',
      email: 'carlos@email.com',
      phone: '+595 981 123 456',
      roomNumber: '205',
      checkIn: '2024-01-20',
      checkOut: '2024-01-25',
      adults: 2,
      children: 1,
      status: 'confirmed',
      totalAmount: 1500000,
      paymentStatus: 'partial',
      notes: 'Llegada tardía - después de las 22:00',
      createdAt: '2024-01-15T10:30:00'
    },
    {
      id: '2',
      guestName: 'Ana Silva',
      email: 'ana.silva@email.com',
      phone: '+595 971 987 654',
      roomNumber: '312',
      checkIn: '2024-01-18',
      checkOut: '2024-01-22',
      adults: 1,
      children: 0,
      status: 'checked-in',
      totalAmount: 800000,
      paymentStatus: 'paid',
      createdAt: '2024-01-10T15:45:00'
    },
    {
      id: '3',
      guestName: 'Roberto García',
      email: 'roberto.g@email.com',
      phone: '+595 961 456 789',
      roomNumber: '101',
      checkIn: '2024-01-25',
      checkOut: '2024-01-30',
      adults: 2,
      children: 2,
      status: 'pending',
      totalAmount: 2000000,
      paymentStatus: 'pending',
      notes: 'Solicita habitación en planta baja',
      createdAt: '2024-01-16T09:15:00'
    }
  ]);

  const [newReservation, setNewReservation] = useState({
    guestName: '',
    email: '',
    phone: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    totalAmount: 0,
    notes: ''
  });

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-600 text-white';
      case 'pending': return 'bg-yellow-600 text-white';
      case 'cancelled': return 'bg-red-600 text-white';
      case 'checked-in': return 'bg-blue-600 text-white';
      case 'checked-out': return 'bg-gray-600 text-white';
    }
  };

  const getPaymentStatusColor = (status: Reservation['paymentStatus']) => {
    switch (status) {
      case 'paid': return 'bg-green-600 text-white';
      case 'partial': return 'bg-yellow-600 text-white';
      case 'pending': return 'bg-red-600 text-white';
      case 'refunded': return 'bg-gray-600 text-white';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreateReservation = () => {
    if (!newReservation.guestName || !newReservation.checkIn || !newReservation.checkOut) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const reservation: Reservation = {
      id: (reservations.length + 1).toString(),
      ...newReservation,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    setReservations([...reservations, reservation]);
    setNewReservation({
      guestName: '',
      email: '',
      phone: '',
      roomNumber: '',
      checkIn: '',
      checkOut: '',
      adults: 1,
      children: 0,
      totalAmount: 0,
      notes: ''
    });

    toast({
      title: "Reserva creada",
      description: `Reserva para ${reservation.guestName} creada exitosamente`,
    });
  };

  const handleStatusChange = (reservationId: string, newStatus: Reservation['status']) => {
    setReservations(reservations.map(res => 
      res.id === reservationId ? { ...res, status: newStatus } : res
    ));

    toast({
      title: "Estado actualizado",
      description: `Reserva marcada como ${newStatus}`,
    });
  };

  const handlePaymentStatusChange = (reservationId: string, newPaymentStatus: Reservation['paymentStatus']) => {
    setReservations(reservations.map(res => 
      res.id === reservationId ? { ...res, paymentStatus: newPaymentStatus } : res
    ));

    toast({
      title: "Estado de pago actualizado",
      description: `Pago marcado como ${newPaymentStatus}`,
    });
  };

  const ReservationCard: React.FC<{ reservation: Reservation }> = ({ reservation }) => (
    <Card className="dashboard-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{reservation.guestName}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getStatusColor(reservation.status)}>
              {reservation.status.toUpperCase()}
            </Badge>
            <Badge className={getPaymentStatusColor(reservation.paymentStatus)}>
              {reservation.paymentStatus.toUpperCase()}
            </Badge>
          </div>
        </div>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Habitación {reservation.roomNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Check-in</div>
              <div className="text-muted-foreground">{new Date(reservation.checkIn).toLocaleDateString('es-PY')}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Check-out</div>
              <div className="text-muted-foreground">{new Date(reservation.checkOut).toLocaleDateString('es-PY')}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{reservation.adults} adultos, {reservation.children} niños</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{formatCurrency(reservation.totalAmount)}</span>
          </div>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3" />
            <span>{reservation.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3" />
            <span>{reservation.email}</span>
          </div>
        </div>

        {reservation.notes && (
          <div className="text-xs p-2 bg-muted/50 rounded border">
            📝 {reservation.notes}
          </div>
        )}

        <div className="flex gap-2 pt-3">
          {reservation.status === 'confirmed' && (
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleStatusChange(reservation.id, 'checked-in')}
            >
              Check-in
            </Button>
          )}
          {reservation.status === 'checked-in' && (
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => handleStatusChange(reservation.id, 'checked-out')}
            >
              Check-out
            </Button>
          )}
          {reservation.status === 'pending' && (
            <>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleStatusChange(reservation.id, 'confirmed')}
              >
                Confirmar
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => handleStatusChange(reservation.id, 'cancelled')}
              >
                Cancelar
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-hotel-red to-hotel-navy bg-clip-text text-transparent">
            {t('sidebar.reservations')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión de reservas del hotel
          </p>
        </div>

        {/* Create New Reservation */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-hotel-red hover:bg-hotel-red/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Reserva
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Reserva</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nombre del Huésped *</label>
                <Input
                  placeholder="Nombre completo"
                  value={newReservation.guestName}
                  onChange={(e) => setNewReservation({...newReservation, guestName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Habitación</label>
                <Select value={newReservation.roomNumber} onValueChange={(value) => setNewReservation({...newReservation, roomNumber: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar habitación" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 100}, (_, i) => (i + 1).toString().padStart(3, '0')).map(num => (
                      <SelectItem key={num} value={num}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={newReservation.email}
                  onChange={(e) => setNewReservation({...newReservation, email: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  placeholder="+595 9xx xxx xxx"
                  value={newReservation.phone}
                  onChange={(e) => setNewReservation({...newReservation, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Check-in *</label>
                <Input
                  type="date"
                  value={newReservation.checkIn}
                  onChange={(e) => setNewReservation({...newReservation, checkIn: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Check-out *</label>
                <Input
                  type="date"
                  value={newReservation.checkOut}
                  onChange={(e) => setNewReservation({...newReservation, checkOut: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Adultos</label>
                <Select value={newReservation.adults.toString()} onValueChange={(value) => setNewReservation({...newReservation, adults: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Niños</label>
                <Select value={newReservation.children.toString()} onValueChange={(value) => setNewReservation({...newReservation, children: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3,4].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Monto Total (Gs.)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newReservation.totalAmount}
                  onChange={(e) => setNewReservation({...newReservation, totalAmount: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Notas</label>
                <Textarea
                  placeholder="Solicitudes especiales o información adicional..."
                  value={newReservation.notes}
                  onChange={(e) => setNewReservation({...newReservation, notes: e.target.value})}
                />
              </div>

              <Button onClick={handleCreateReservation} className="col-span-2 bg-hotel-red hover:bg-hotel-red/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Crear Reserva
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{reservations.filter(r => r.status === 'pending').length}</div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{reservations.filter(r => r.status === 'confirmed').length}</div>
              <div className="text-sm text-muted-foreground">Confirmadas</div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{reservations.filter(r => r.status === 'checked-in').length}</div>
              <div className="text-sm text-muted-foreground">Check-in</div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{reservations.filter(r => r.status === 'checked-out').length}</div>
              <div className="text-sm text-muted-foreground">Check-out</div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{reservations.filter(r => r.status === 'cancelled').length}</div>
              <div className="text-sm text-muted-foreground">Canceladas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
    </div>
  );
};

export default Reservations;