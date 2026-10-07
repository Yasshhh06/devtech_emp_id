-- ================================================================
-- DevTech IT Solutions - Employee ID & Verification System Schema
-- Execute this SQL script in Supabase Dashboard -> SQL Editor
-- ================================================================

-- 1. Create Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
    id TEXT PRIMARY KEY,
    employee_id TEXT UNIQUE NOT NULL,
    employee_code TEXT,
    full_name TEXT NOT NULL,
    photo TEXT,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    company_email TEXT,
    personal_email TEXT,
    phone TEXT,
    emergency_contact TEXT,
    date_of_joining TEXT,
    valid_till TEXT,
    blood_group TEXT,
    gender TEXT,
    date_of_birth TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    pin_code TEXT,
    manager_name TEXT,
    employment_type TEXT,
    status TEXT DEFAULT 'Active',
    emergency_notes TEXT,
    signature TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    notes JSONB DEFAULT '[]'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    certificates JSONB DEFAULT '[]'::jsonb,
    qr_url TEXT,
    verification_count INT DEFAULT 0,
    last_verified_at TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_by TEXT DEFAULT 'HR Admin'
);

-- Index for instant public QR verification by Employee ID
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON public.employees(employee_id);

-- 2. Create Interns Table
CREATE TABLE IF NOT EXISTS public.interns (
    id TEXT PRIMARY KEY,
    intern_id TEXT UNIQUE NOT NULL,
    intern_code TEXT,
    full_name TEXT NOT NULL,
    photo TEXT,
    department TEXT NOT NULL,
    role TEXT NOT NULL,
    college TEXT,
    duration TEXT,
    start_date TEXT,
    end_date TEXT,
    mentor_name TEXT,
    status TEXT DEFAULT 'Active',
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Index for instant public QR verification by Intern ID
CREATE INDEX IF NOT EXISTS idx_interns_intern_id ON public.interns(intern_id);

-- 3. Create Verification Logs Table
CREATE TABLE IF NOT EXISTS public.verification_logs (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    employee_name TEXT,
    timestamp TEXT NOT NULL,
    browser TEXT,
    device_type TEXT,
    location TEXT,
    ip TEXT,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    performed_by TEXT NOT NULL,
    target_employee_id TEXT,
    target_employee_name TEXT,
    timestamp TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    company_name TEXT DEFAULT 'DevTech IT Solution',
    company_logo TEXT,
    tagline TEXT,
    website TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    headquarters_address TEXT,
    auto_logout_minutes INT DEFAULT 30,
    card_template TEXT DEFAULT 'modern-dark',
    branches JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Public Verification Allowed)
-- ================================================================

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Allow Public Reads & Full Management for Employees
DROP POLICY IF EXISTS "Public employees access" ON public.employees;
CREATE POLICY "Public employees access" ON public.employees FOR ALL USING (true) WITH CHECK (true);

-- Allow Public Reads & Full Management for Interns
DROP POLICY IF EXISTS "Public interns access" ON public.interns;
CREATE POLICY "Public interns access" ON public.interns FOR ALL USING (true) WITH CHECK (true);

-- Allow Public Reads & Inserts for Verification Logs
DROP POLICY IF EXISTS "Public verification logs access" ON public.verification_logs;
CREATE POLICY "Public verification logs access" ON public.verification_logs FOR ALL USING (true) WITH CHECK (true);

-- Allow Audit Logs Read & Write
DROP POLICY IF EXISTS "Public audit logs access" ON public.audit_logs;
CREATE POLICY "Public audit logs access" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- Allow Settings Read & Write
DROP POLICY IF EXISTS "Public settings access" ON public.system_settings;
CREATE POLICY "Public settings access" ON public.system_settings FOR ALL USING (true) WITH CHECK (true);
