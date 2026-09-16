"use client";

import { useRef, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/app/actions/upload";
import { Camera, Loader2, CheckCircle2, AlertCircle, User } from "lucide-react";
import Image from "next/image";

interface SettingsFormProps {
  initialName: string;
  initialBio: string;
  initialAvatarUrl: string | null;
  email: string;
}

export function SettingsForm({ initialName, initialBio, initialAvatarUrl, email }: SettingsFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (avatarFile) formData.set("avatar", avatarFile);

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.success) {
        setStatus({ type: "success", message: result.message });
        setAvatarFile(null);
      } else {
        setStatus({ type: "error", message: result.message });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
        <CardHeader className="border-b-2 border-black bg-muted/30">
          <CardTitle className="font-black text-xl">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">

          {/* Avatar Upload */}
          <div className="space-y-3">
            <label className="font-bold text-sm block">Profile Picture</label>
            <div className="flex items-center gap-6">
              {/* Avatar preview */}
              <div
                className="relative w-20 h-20 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-muted flex-shrink-0 cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar" fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {avatarPreview ? "Change Photo" : "Upload Photo"}
                </Button>
                <p className="text-xs text-muted-foreground font-medium">
                  JPG, PNG or WebP · Max 5 MB
                </p>
                {avatarFile && (
                  <p className="text-xs font-bold text-green-600">{avatarFile.name} selected</p>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="font-bold text-sm" htmlFor="name">Full Name</label>
            <Input
              id="name"
              name="name"
              defaultValue={initialName}
              placeholder="Your full name"
              className="h-12 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-medium"
            />
          </div>

          {/* Email — read-only */}
          <div className="space-y-2">
            <label className="font-bold text-sm">Email Address</label>
            <Input
              value={email}
              disabled
              className="h-12 border-2 border-black rounded-none bg-muted font-medium text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs font-medium text-muted-foreground">
              Your email address is used for login and cannot be changed here.
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="font-bold text-sm" htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={initialBio}
              className="flex w-full border-2 border-black bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-medium resize-y"
              placeholder="Tell your audience a little bit about yourself..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Status message */}
      {status && (
        <div className={`flex items-center gap-2 p-3 rounded-md border-2 font-bold text-sm ${
          status.type === "success"
            ? "bg-green-50 border-green-500 text-green-700"
            : "bg-red-50 border-red-500 text-red-700"
        }`}>
          {status.type === "success"
            ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {status.message}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary text-black hover:bg-primary/90 h-12 px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-base disabled:opacity-60"
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
