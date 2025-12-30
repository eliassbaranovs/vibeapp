import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Folder, Layout } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="flex flex-1 items-center justify-center bg-linear-to-b from-slate-50 to-white px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <CheckCircle2 className="h-4 w-4" />
            Simple Project Management
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            TaskForge
          </h1>

          <p className="mb-8 text-xl text-slate-600">
            Organize your projects and tasks in one place.
            <br />
            Simple, fast, and focused on what matters.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/app">Get Started</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Folder className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Projects</h3>
              <p className="text-sm text-muted-foreground">
                Organize work into projects
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Track tasks and completion
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Layout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Simple</h3>
              <p className="text-sm text-muted-foreground">
                Clean interface, no clutter
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © 2025 TaskForge. Built with Next.js and Supabase.
        </div>
      </footer>
    </div>
  );
}
