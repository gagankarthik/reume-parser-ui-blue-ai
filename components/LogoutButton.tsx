"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import { logout } from "@/lib/account";

export function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      onClick={async () => {
        await logout();
        router.push("/login");
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}
