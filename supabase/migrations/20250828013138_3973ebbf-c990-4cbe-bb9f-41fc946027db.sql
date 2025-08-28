-- Função para buscar dados dos quartos
CREATE OR REPLACE FUNCTION get_rooms_data()
RETURNS TABLE(
  id bigint,
  number integer,
  status text,
  guestname text,
  guestphotourl text,
  checkin date,
  checkout date,
  reminder text
) LANGUAGE sql STABLE AS $$
  SELECT id, number, status, guestname, guestphotourl, checkin, checkout, reminder
  FROM rooms
  ORDER BY number;
$$;

-- Função para fazer check-in
CREATE OR REPLACE FUNCTION checkin_room(
  room_id bigint,
  guest_name text,
  guest_country text,
  guest_id_number text,
  guest_photo_url text,
  check_in_date date,
  check_out_date date,
  notes text
) RETURNS void LANGUAGE sql AS $$
  UPDATE rooms 
  SET 
    status = 'occupied',
    guestname = guest_name,
    guestcountry = guest_country,
    guestidnumber = guest_id_number,
    guestphotourl = guest_photo_url,
    checkin = check_in_date,
    checkout = check_out_date,
    reminder = notes
  WHERE id = room_id;
$$;

-- Função para fazer check-out
CREATE OR REPLACE FUNCTION checkout_room(room_number integer)
RETURNS void LANGUAGE sql AS $$
  UPDATE rooms 
  SET 
    status = 'available',
    guestname = null,
    guestcountry = null,
    guestidnumber = null,
    guestphotourl = null,
    checkin = null,
    checkout = null,
    reminder = null
  WHERE number = room_number;
$$;