import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface RoomForDisplay {
  id: string;
  number: string;
  status: "available" | "occupied" | "maintenance" | "cleaning";
  reminder?: { time: string } | null;
  guest?: {
    name: string;
    photoUrl?: string;
    checkInDate: string;
    checkOutDate: string;
    notes?: string;
  } | null;
}

// Buscar todos os quartos
export async function getRooms(): Promise<RoomForDisplay[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_rooms_data');

    if (error) {
      // Fallback para query direta se RPC não existir
      const { data: roomsData, error: queryError } = await supabase
        .from('rooms')
        .select('*')
        .order('number');
      
      if (queryError) throw queryError;
      if (!roomsData) return [];

      return roomsData.map((room: any) => ({
        id: room.id.toString(),
        number: room.number.toString(),
        status: (room.status || 'available') as "available" | "occupied" | "maintenance" | "cleaning",
        reminder: room.reminder ? { time: room.reminder } : null,
        guest: room.guestname ? {
          name: room.guestname,
          photoUrl: room.guestphotourl || undefined,
          checkInDate: room.checkin || '',
          checkOutDate: room.checkout || '',
          notes: room.reminder || undefined
        } : null
      }));
    }

    return data || [];
  } catch (err) {
    console.error("Erro ao buscar quartos:", err);
    throw err;
  }
}

// Fazer check-in de um quarto
export async function checkInRoom(roomId: string, guestData: any): Promise<void> {
  try {
    const { error } = await supabase
      .rpc('checkin_room', {
        room_id: parseInt(roomId),
        guest_name: guestData.fullName || 'Hóspede',
        guest_country: guestData.country,
        guest_id_number: guestData.documentNumber,
        guest_photo_url: guestData.photo,
        check_in_date: guestData.checkInDate,
        check_out_date: guestData.checkOutDate,
        notes: guestData.notes
      });

    if (error) throw error;
  } catch (err) {
    console.error("Erro ao fazer check-in:", err);
    throw err;
  }
}

// Fazer check-out de um quarto
export async function checkoutRoom(roomNumber: string): Promise<void> {
  try {
    const { error } = await supabase
      .rpc('checkout_room', {
        room_number: parseInt(roomNumber)
      });

    if (error) throw error;
  } catch (err) {
    console.error("Erro ao fazer check-out:", err);
    throw err;
  }
}