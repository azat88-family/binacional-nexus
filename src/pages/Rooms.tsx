import { useEffect, useState } from "react";
import { getRooms, checkoutRoom, checkInRoom } from "../lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckIn } from "@/components/RoomActions";

// Recriando RoomCard baseado no código antigo
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Bed, AlertTriangle, Sparkles, Clock, CheckCircle, XCircle, Receipt, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestInfo {
  name: string;
  photoUrl?: string;
  checkInDate: string;
  checkOutDate: string;
  notes?: string;
}

interface Room {
  id: number;
  number: number;
  status: "available" | "occupied" | "maintenance" | "cleaning";
  reminder?: { time: string } | null;
  guest?: GuestInfo | null;
}

export default function Rooms() {
  const { t } = useLanguage();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleCheckIn = async (roomId: number, guestData: any) => {
    try {
      const apiGuestData = {
        guestName: guestData.fullName,
        guestCountry: guestData.country,
        guestIdNumber: guestData.documentNumber,
        guestPhotoUrl: guestData.photo,
        guestBirthDate: null, // Not in form
        checkIn: guestData.checkInDate,
        checkOut: guestData.checkOutDate,
        reminder: guestData.notes,
      };

      // We also need to pass the room number to the API
      const roomToUpdate = rooms.find(r => r.id === roomId);
      if (roomToUpdate) {
        await checkInRoom(roomId, { ...apiGuestData, number: roomToUpdate.number });
        fetchRooms(); // Refetch rooms to see the update
        setSelectedRoom(null); // Close the dialog
      }
    } catch (error) {
      console.error("Erro ao fazer check-in:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      console.error("Erro ao carregar quartos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomUpdate = async (roomNumber: number, newStatus: Room["status"]) => {
    try {
      if (newStatus === "available") {
        await checkoutRoom(roomNumber);
      }

      setRooms(prev =>
        prev.map(room =>
          room.number === roomNumber
            ? { ...room, status: newStatus, guest: newStatus === "available" ? null : room.guest, reminder: newStatus === "available" ? null : room.reminder }
            : room
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar quarto:", err);
    }
  };

  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "occupied":
        return "room-occupied";
      case "available":
        return "room-available";
      case "maintenance":
        return "room-maintenance";
      case "cleaning":
        return "room-cleaning";
      default:
        return "bg-muted";
    }
  };

  const getStatusIcon = (status: Room["status"]) => {
    switch (status) {
      case "occupied":
        return <User className="w-4 h-4" />;
      case "available":
        return <Bed className="w-4 h-4" />;
      case "maintenance":
        return <AlertTriangle className="w-4 h-4" />;
      case "cleaning":
        return <Sparkles className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Room["status"]) => {
    const key = `rooms.${status}`;
    return t(key);
  };

  const RoomCard = ({ room }: { room: Room }) => (
    <Card className={`hotel-card ${getStatusColor(room.status)} text-white cursor-pointer`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{room.number}</CardTitle>
          <div className="flex items-center gap-1">{getStatusIcon(room.status)}</div>
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
              <span>Check-out: {room.guest.checkOutDate}</span>
            </div>
            {room.guest.notes && (
              <div className="text-xs p-2 bg-white/10 rounded border border-white/20">
                📝 {room.guest.notes}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
          {room.status === "available" ? (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white border-0"
              onClick={() => setSelectedRoom(room)}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              {t('rooms.checkin')}
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white border-0"
              onClick={() => handleRoomUpdate(room.number, "available")}
            >
              <XCircle className="w-3 h-3 mr-1" />
              Check-out
            </Button>
          )}

          {room.status === "occupied" ? (
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
              onClick={() => window.open("https://ekuatia.set.gov.py/ekuatiai", "_blank")}
            >
              <Receipt className="w-3 h-3 mr-1" />
              Factura
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white border-0"
              onClick={() => alert("Função de manutenção")}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Mantenimiento
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) return <p className="p-6 text-lg">Carregando quartos...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestão de Quartos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {rooms.map(room => (
          <RoomCard key={room.number} room={room} />
        ))}
      </div>

      {selectedRoom && (
        <Dialog
          open={!!selectedRoom}
          onOpenChange={(isOpen) => !isOpen && setSelectedRoom(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Check-in - Quarto {selectedRoom.number}</DialogTitle>
              <DialogDescription>
                Registro de novo hóspede
              </DialogDescription>
            </DialogHeader>
            <CheckIn
              roomNumber={String(selectedRoom.number)}
              onCheckIn={(guestData) => handleCheckIn(selectedRoom.id, guestData)}
              t={t}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}