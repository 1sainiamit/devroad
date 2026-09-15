"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter">Settings</h1>
        <p className="text-muted-foreground mt-1 font-medium">Manage your account and store preferences.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader className="border-b-2 border-black bg-muted/30">
            <CardTitle className="font-black text-xl">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="font-bold text-sm">Full Name</label>
              <Input 
                defaultValue={user?.name || ""} 
                className="h-12 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-bold text-sm">Email Address</label>
              <Input 
                defaultValue={user?.email || ""} 
                disabled
                className="h-12 border-2 border-black rounded-none bg-muted font-medium text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs font-medium text-muted-foreground">Your email address is used for login and cannot be changed here.</p>
            </div>
            
            <div className="space-y-2">
              <label className="font-bold text-sm">Bio</label>
              <textarea 
                className="flex w-full border-2 border-black bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-medium resize-y"
                placeholder="Tell your audience a little bit about yourself..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader className="border-b-2 border-black bg-muted/30">
            <CardTitle className="font-black text-xl">Store Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="font-bold text-sm">Store Name</label>
              <Input 
                placeholder="e.g. Acme Digital Assets" 
                className="h-12 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-bold text-sm">Currency</label>
              <select className="flex h-12 w-full border-2 border-black bg-transparent px-3 py-2 text-base rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold cursor-pointer">
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button className="bg-primary text-black hover:bg-primary/90 h-12 px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-base">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
