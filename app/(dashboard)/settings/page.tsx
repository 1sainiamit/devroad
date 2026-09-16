import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, bio: true, avatarUrl: true },
  });

  if (!dbUser) redirect("/login");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter">Settings</h1>
        <p className="text-muted-foreground mt-1 font-medium">
          Manage your account and store preferences.
        </p>
      </div>

      <SettingsForm
        initialName={dbUser.name ?? ""}
        initialBio={dbUser.bio ?? ""}
        initialAvatarUrl={dbUser.avatarUrl ?? null}
        email={dbUser.email}
      />
    </div>
  );
}
