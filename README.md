# TaskForge

A modern, simple project and task management application built with Next.js and Supabase.

## Features

- **Project Management**: Create, edit, and organize projects
- **Task Tracking**: Add tasks to projects, mark as complete, edit and delete
- **Real-time Updates**: Powered by React Query for instant UI updates
- **Secure Authentication**: User authentication via Supabase Auth
- **Row-Level Security**: Database-level security with Supabase RLS policies
- **Modern UI**: Clean, responsive design with ShadCN UI components
- **Dark Mode Ready**: Beautiful split-screen login with branding panel

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Data Fetching**: [@tanstack/react-query](https://tanstack.com/query)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## Database Structure

### Tables

**`projects`**

- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `name` (TEXT)
- `created_at` (TIMESTAMPTZ)

**`tasks`**

- `id` (UUID, PK)
- `project_id` (UUID, FK → projects, CASCADE)
- `user_id` (UUID, FK → auth.users)
- `title` (TEXT)
- `is_done` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)

### Row-Level Security (RLS)

All tables have RLS enabled with policies enforcing:

- Users can only see/modify their own projects and tasks
- Cascade delete on project removal
- Ownership-based access control

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project ([create one here](https://supabase.com))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vibeapp.git
cd vibeapp
```

1. Install dependencies:

```bash
npm install
```

1. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

1. Run database migrations (see Database Setup below)

1. Start the development server:

```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000)

### Database Setup

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX projects_user_id_idx ON projects(user_id);
CREATE INDEX projects_created_at_idx ON projects(user_id, created_at DESC);
CREATE INDEX tasks_user_id_idx ON tasks(user_id);
CREATE INDEX tasks_project_id_idx ON tasks(project_id);
CREATE INDEX tasks_created_at_idx ON tasks(project_id, created_at DESC);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);
```

## Project Structure

```plaintext
vibeapp/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Authentication
│   ├── logout/page.tsx             # Logout handler
│   └── app/
│       ├── layout.tsx              # Protected layout with sidebar
│       ├── page.tsx                # Dashboard (projects list)
│       ├── projects/[projectId]/   # Project detail with tasks
│       └── settings/               # User settings
├── components/ui/                  # ShadCN UI components
├── lib/
│   ├── supabase/                   # Supabase clients
│   ├── queries/                    # React Query hooks
│   ├── auth/                       # Auth helpers
│   └── providers/                  # React Query provider
└── public/
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
4. Deploy!

The app automatically deploys from:

- `master` branch → Production
- `develop` branch → Preview

## Upcoming Features

**Role-Based Access Control (RBAC)** - See [ROLE_BASED_ACCESS_CONTROL.md](./ROLE_BASED_ACCESS_CONTROL.md)

Planned roles:

- **Owner**: Project creator, full control, can transfer ownership
- **Admin**: Full access, can manage members
- **Editor**: Can create/edit/delete tasks, view projects
- **Viewer**: Read-only access

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
