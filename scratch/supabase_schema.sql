-- Create Subcontractors table
CREATE TABLE IF NOT EXISTS subcontractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  base_city TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Subcontractor Regions
CREATE TABLE IF NOT EXISTS subcontractor_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcontractor_id UUID REFERENCES subcontractors(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcontractor_id UUID REFERENCES subcontractors(id),
  customer_name TEXT,
  customer_phone TEXT,
  car_model TEXT,
  pickup_location TEXT,
  delivery_location TEXT,
  status TEXT DEFAULT 'pending', -- pending, accepted, in_progress, completed, cancelled
  price_total DECIMAL(10, 2),
  price_subcontractor DECIMAL(10, 2),
  commission DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Dispatch Notes table
CREATE TABLE IF NOT EXISTS dispatch_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcontractor_id UUID REFERENCES subcontractors(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subcontractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractor_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_notes ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin access' AND tablename = 'subcontractors') THEN
        CREATE POLICY "Admin access" ON subcontractors FOR ALL USING (auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin access' AND tablename = 'subcontractor_regions') THEN
        CREATE POLICY "Admin access" ON subcontractor_regions FOR ALL USING (auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin access' AND tablename = 'jobs') THEN
        CREATE POLICY "Admin access" ON jobs FOR ALL USING (auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin access' AND tablename = 'dispatch_notes') THEN
        CREATE POLICY "Admin access" ON dispatch_notes FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;
