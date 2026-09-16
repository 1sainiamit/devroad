"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, RefreshCw, Unplug } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface OnboardingFormProps {
  isConnected: boolean;
}

export function OnboardingForm({ isConnected }: OnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/razorpay/connect", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Bank details saved successfully! Payouts are now active.");
        window.location.reload();
      } else {
        toast.error(data || "Failed to save bank details.");
      }
    } catch (error) {
      toast.error("An error occurred while setting up payouts.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      const res = await fetch("/api/razorpay/disconnect", { method: "POST" });

      if (res.ok) {
        toast.success("Bank account disconnected successfully.");
        window.location.reload();
      } else {
        toast.error("Failed to disconnect bank account.");
      }
    } catch (error) {
      toast.error("An error occurred while disconnecting.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isConnected && !showUpdateForm) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button 
          onClick={() => setShowUpdateForm(true)}
          className="h-12 px-6 bg-white text-black border-4 border-black hover:bg-muted font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-base"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Update Bank Details
        </Button>
        <Button 
          onClick={handleDisconnect}
          disabled={isDisconnecting}
          variant="outline"
          className="h-12 px-6 bg-white text-red-600 border-4 border-red-600 hover:bg-red-50 font-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] transition-all text-base"
        >
          {isDisconnecting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Unplug className="w-4 h-4 mr-2" />
          )}
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-6 text-left">
      <div>
        <label className="block text-sm font-bold text-black mb-1">Beneficiary / Business Name</label>
        <Input 
          name="businessName"
          required
          value={formData.businessName}
          onChange={handleChange}
          className="border-2 border-black rounded-md h-12" 
          placeholder="Acme Corp" 
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-black mb-1">Account Number</label>
        <Input 
          name="accountNumber"
          required
          value={formData.accountNumber}
          onChange={handleChange}
          type="password"
          autoComplete="off"
          className="border-2 border-black rounded-md h-12" 
          placeholder="1234567890" 
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-black mb-1">IFSC Code</label>
        <Input 
          name="ifscCode"
          required
          value={formData.ifscCode}
          onChange={handleChange}
          className="border-2 border-black rounded-md h-12" 
          placeholder="HDFC0001234" 
        />
      </div>
      <div className="flex gap-3">
        <Button 
          type="submit"
          disabled={isLoading}
          className="flex-1 h-14 mt-4 bg-[#ff90e8] text-black border-4 border-black hover:bg-[#ff90e8]/90 font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-xl"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
          ) : (
            <ArrowRight className="w-6 h-6 mr-2" />
          )}
          Save Bank Details
        </Button>
        {isConnected && (
          <Button
            type="button"
            onClick={() => setShowUpdateForm(false)}
            className="h-14 mt-4 px-6 bg-white text-black border-4 border-black hover:bg-muted font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-lg"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

