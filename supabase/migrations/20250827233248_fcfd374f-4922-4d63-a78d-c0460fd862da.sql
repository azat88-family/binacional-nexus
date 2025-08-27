-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.room_status AS ENUM ('available', 'occupied', 'maintenance', 'cleaning');
CREATE TYPE public.room_type AS ENUM ('single', 'double', 'suite', 'family');
CREATE TYPE public.reservation_status AS ENUM ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled');
CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.user_role AS ENUM ('admin', 'attendant');
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role DEFAULT 'attendant',
  approval_status approval_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number TEXT NOT NULL UNIQUE,
  room_type room_type NOT NULL,
  status room_status DEFAULT 'available',
  floor INTEGER,
  capacity INTEGER DEFAULT 2,
  price_per_night DECIMAL(10,2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  guest_document TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  total_amount DECIMAL(10,2),
  status reservation_status DEFAULT 'pending',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance tasks table
CREATE TABLE public.maintenance_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'pending',
  assigned_to UUID REFERENCES auth.users(id),
  estimated_duration INTEGER, -- in minutes
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cleaning tasks table
CREATE TABLE public.cleaning_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL, -- 'daily', 'checkout', 'deep_cleaning'
  status task_status DEFAULT 'pending',
  assigned_to UUID REFERENCES auth.users(id),
  estimated_duration INTEGER, -- in minutes
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  checklist JSONB, -- for cleaning checklist items
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_tasks ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE user_id = auth.uid() AND approval_status = 'approved';
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to check if user is approved
CREATE OR REPLACE FUNCTION public.is_user_approved()
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approval_status = 'approved'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Rooms policies
CREATE POLICY "Approved users can view rooms" ON public.rooms
  FOR SELECT USING (public.is_user_approved());

CREATE POLICY "Approved users can update rooms" ON public.rooms
  FOR UPDATE USING (public.is_user_approved());

-- Reservations policies
CREATE POLICY "Approved users can view reservations" ON public.reservations
  FOR SELECT USING (public.is_user_approved());

CREATE POLICY "Approved users can insert reservations" ON public.reservations
  FOR INSERT WITH CHECK (public.is_user_approved() AND created_by = auth.uid());

CREATE POLICY "Approved users can update reservations" ON public.reservations
  FOR UPDATE USING (public.is_user_approved());

-- Maintenance tasks policies
CREATE POLICY "Approved users can view maintenance tasks" ON public.maintenance_tasks
  FOR SELECT USING (public.is_user_approved());

CREATE POLICY "Approved users can insert maintenance tasks" ON public.maintenance_tasks
  FOR INSERT WITH CHECK (public.is_user_approved() AND created_by = auth.uid());

CREATE POLICY "Approved users can update maintenance tasks" ON public.maintenance_tasks
  FOR UPDATE USING (public.is_user_approved());

-- Cleaning tasks policies
CREATE POLICY "Approved users can view cleaning tasks" ON public.cleaning_tasks
  FOR SELECT USING (public.is_user_approved());

CREATE POLICY "Approved users can insert cleaning tasks" ON public.cleaning_tasks
  FOR INSERT WITH CHECK (public.is_user_approved() AND created_by = auth.uid());

CREATE POLICY "Approved users can update cleaning tasks" ON public.cleaning_tasks
  FOR UPDATE USING (public.is_user_approved());

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_tasks_updated_at
  BEFORE UPDATE ON public.maintenance_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cleaning_tasks_updated_at
  BEFORE UPDATE ON public.cleaning_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample rooms data
INSERT INTO public.rooms (room_number, room_type, floor, capacity, price_per_night, description) VALUES
('101', 'single', 1, 1, 50.00, 'Quarto simples no primeiro andar'),
('102', 'double', 1, 2, 75.00, 'Quarto duplo no primeiro andar'),
('103', 'double', 1, 2, 75.00, 'Quarto duplo no primeiro andar'),
('201', 'suite', 2, 3, 120.00, 'Suíte no segundo andar'),
('202', 'family', 2, 4, 100.00, 'Quarto familiar no segundo andar'),
('301', 'single', 3, 1, 55.00, 'Quarto simples no terceiro andar'),
('302', 'double', 3, 2, 80.00, 'Quarto duplo no terceiro andar'),
('303', 'suite', 3, 3, 130.00, 'Suíte premium no terceiro andar');