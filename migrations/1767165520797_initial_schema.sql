CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'employee' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

CREATE TABLE IF NOT EXISTS leaves (
  leave_id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  employee_id uuid NOT NULL,
  employee_name text NOT NULL,
  leave_type text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  approval_status text DEFAULT 'pending' NOT NULL,
  approved_by uuid,
  approval_notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_leaves_employee ON leaves (employee_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON leaves (approval_status);
CREATE INDEX IF NOT EXISTS idx_leaves_dates ON leaves (start_date, end_date);

CREATE TABLE IF NOT EXISTS milestones (
  milestone_id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  milestone_name text NOT NULL,
  description text,
  target_date date NOT NULL,
  status text DEFAULT 'active' NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones (status);
CREATE INDEX IF NOT EXISTS idx_milestones_target_date ON milestones (target_date);

CREATE TABLE IF NOT EXISTS tasks (
  task_id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  task_description text NOT NULL,
  task_details text,
  assigned_to uuid NOT NULL,
  created_by uuid NOT NULL,
  status text DEFAULT 'todo' NOT NULL,
  priority text DEFAULT 'medium' NOT NULL,
  due_date date NOT NULL,
  associated_milestone_id uuid,
  completion_date timestamp with time zone,
  creation_date timestamp with time zone DEFAULT now() NOT NULL,
  last_updated_date timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks (assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks (priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks (due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_milestone ON tasks (associated_milestone_id);