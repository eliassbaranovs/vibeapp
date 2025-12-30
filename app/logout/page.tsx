"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LogoutPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.push("/login");
    };

    signOut();
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Signing out...</p>
    </div>
  );
}
