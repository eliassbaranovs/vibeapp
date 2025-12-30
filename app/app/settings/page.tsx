import { requireUser } from "@/lib/auth/requireUser";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { User, Mail, Key, LogOut } from "lucide-react";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Account Information</h2>
              <p className="text-sm text-muted-foreground">
                Your personal account details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Email Address</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Key className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">User ID</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {user.id}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <LogOut className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Actions</h2>
              <p className="text-sm text-muted-foreground">
                Manage your session
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Sign Out</p>
              <p className="text-sm text-muted-foreground">
                End your current session
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/logout" className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
