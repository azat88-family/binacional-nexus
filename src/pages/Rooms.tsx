import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckIn, CheckOut, Invoice } from '@/components/RoomActions';
import { 
  Bed, 
  User, 
  Clock,
  ExternalLink,
  CheckCircle,
  XCircle,
  Receipt,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface Room {
  number: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  guest?: {
    name: string;
    photo?: string;
    checkIn: string;
    checkOut: string;
    notes?: string;
  };
}

const Rooms: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Generate 100 rooms with mock data
  const [rooms, setRooms] = useState<Room[]>(() => {
    const roomList: Room[] = [];
    for (let i = 1; i <= 100; i++) {
      const number = i.toString().padStart(3, '0');
      let status: Room['status'] = 'available';
      let guest;

      // Mock some occupied rooms
      if (i <= 68) {
        status = 'occupied';
        guest = {
          name: `Huésped ${i}`,
          checkIn: '2024-01-15',
          checkOut: '2024-01-20',
          notes: i % 3 === 0 ? 'Despertar 7:00 AM' : undefined,
        };
      } else if (i <= 72) {
        status = 'maintenance';
      } else if (i <= 75) {
        status = 'cleaning';
      }

      roomList.push({ number, status, guest });
    }
    return roomList;
  });

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'occupied':
        return 'room-occupied';
      case 'available':
        return 'room-available';
      case 'maintenance':
        return 'room-maintenance';
      case 'cleaning':
        return 'room-cleaning';
      default:
        return 'bg-muted';
    }
  };

  const getStatusIcon = (status: Room['status']) => {
    switch (status) {
      case 'occupied':
        return <User className="w-4 h-4" />;
      case 'available':
        return <Bed className="w-4 h-4" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4" />;
      case 'cleaning':
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: Room['status']) => {
    switch (status) {
      case 'occupied':
        return t('rooms.occupied');
      case 'available':
        return t('rooms.available');
      case 'maintenance':
        return t('rooms.maintenance');
      case 'cleaning':
        return t('rooms.cleaning');
      default:
        return status;
    }
  };

  const handleRoomUpdate = (roomNumber: string, newStatus: Room['status'], guestData?: any) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.number === roomNumber
          ? { ...room, status: newStatus, guest: guestData }
          : room
      )
    );
  };

  const RoomCard: React.FC<{ room: Room }> = ({ room }) => (
    <Card className={`hotel-card ${getStatusColor(room.status)} text-white cursor-pointer`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">
            {room.number}
          </CardTitle>
          <div className="flex items-center gap-1">
            {getStatusIcon(room.status)}
          </div>
        </div>
        <Badge variant="outline" className="w-fit border-white/30 text-white">
          {getStatusText(room.status)}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {room.guest && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{room.guest.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs opacity-90">
              <Clock className="w-3 h-3" />
              <span>Check-out: {room.guest.checkOut}</span>
            </div>
            {room.guest.notes && (
              <div className="text-xs p-2 bg-white/10 rounded border border-white/20">
                📝 {room.guest.notes}
              </div>
            )}
          </div>
        )}

        {/* Action buttons for all rooms */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {/* Check-in/Check-out buttons */}
          {room.status === 'available' ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Check-in
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Check-in - Habitación {room.number}</DialogTitle>
                  <DialogDescription>
                    Registro de nuevo huésped
                  </DialogDescription>
                </DialogHeader>
                <CheckIn roomNumber={room.number} onUpdate={handleRoomUpdate} />
              </DialogContent>
            </Dialog>
          ) : (
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white border-0"
              onClick={() => handleRoomUpdate(room.number, 'available')}
            >
              <XCircle className="w-3 h-3 mr-1" />
              Check-out
            </Button>
          )}

          {/* Invoice button for occupied rooms */}
          {room.status === 'occupied' ? (
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
              onClick={() => window.open('https://ekuatia.set.gov.py/ekuatiai', '_blank')}
            >
              <Receipt className="w-3 h-3 mr-1" />
              Factura
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white border-0"
              onClick={() => navigate('/maintenance')}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Mantenimiento
            </Button>
          )}

          {/* Cleaning button */}
          <Button 
            size="sm" 
            className="bg-yellow-600 hover:bg-yellow-700 text-white border-0 col-span-2"
            onClick={() => navigate('/cleaning')}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Limpieza
          </Button>
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
            {t('rooms.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión de las 100 habitaciones del hotel
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-success">
              {rooms.filter(r => r.status === 'available').length}
            </div>
            <div className="text-muted-foreground">Disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-hotel-red">
              {rooms.filter(r => r.status === 'occupied').length}
            </div>
            <div className="text-muted-foreground">Ocupadas</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-warning">
              {rooms.filter(r => r.status === 'maintenance').length}
            </div>
            <div className="text-muted-foreground">Mantenimiento</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-hotel-navy">
              {rooms.filter(r => r.status === 'cleaning').length}
            </div>
            <div className="text-muted-foreground">Limpieza</div>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rooms.map((room) => (
          <RoomCard key={room.number} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;