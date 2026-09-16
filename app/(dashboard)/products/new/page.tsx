"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { createProduct } from "@/app/actions/products";
import { Loader2 } from "lucide-react";

const ProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  price: z.string().refine((value) => {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0;
  }, "Invalid price amount"),
  currency: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export default function NewProduct() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreateProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      currency: formData.get("currency") as string || "INR",
      category: formData.get("category") as string || "",
      status: formData.get("status") as "DRAFT" | "PUBLISHED",
    };

    const result = ProductSchema.safeParse(data);

    if (!result.success) {
      toast.error("Validation error", {
        description: result.error.issues[0].message,
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await createProduct(result.data);

        if (!response.success || !response.data) {
          toast.error("Error creating product", {
            description: response.message,
          });
          return;
        }

        toast.success("Product created successfully!", {
          description: "You can now upload files and customize your product.",
        });
        
        router.push(`/products/${response.data.id}/edit`);
      } catch (error) {
        toast.error("Failed to create product");
      }
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Create Product</h1>
          <p className="text-muted-foreground mt-1 font-medium">Add your first digital product to the store.</p>
        </div>
        <Button 
          onClick={() => router.push("/products")} 
          variant="outline"
          className="border-2 border-black font-bold h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleCreateProduct} className="space-y-8 mt-8">
        <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="border-b-2 border-black bg-muted/30">
            <CardTitle className="flex items-center gap-3 font-black text-xl">
              <Badge className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-black bg-white text-black text-lg">
                1
              </Badge>
              Basic Information
            </CardTitle>
            <CardDescription className="font-medium text-black/70">
              Give your product a name and a compelling description.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-bold text-base">Product Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Notion Dashboard Template"
                className="h-12 text-base px-4 font-medium border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold text-base">Product Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell your customers about your product..."
                className="min-h-[150px] text-base border-2 border-black p-4 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all resize-y"
                required
                disabled={isPending}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="border-b-2 border-black bg-muted/30">
            <CardTitle className="flex items-center gap-3 font-black text-xl">
              <Badge className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-black bg-white text-black text-lg">
                2
              </Badge>
              Pricing & Availability
            </CardTitle>
            <CardDescription className="font-medium text-black/70">
              Set the price and visibility of your product.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="font-bold text-base">Price (in ₹)</Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground">
                    ₹
                  </div>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="50"
                    className="h-14 pl-10 pr-4 text-2xl font-black border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    min="0"
                    required
                    disabled={isPending}
                  />
                </div>
                <p className="text-sm font-bold text-muted-foreground mt-1">
                  e.g., 50 = ₹50
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="font-bold text-base">Currency</Label>
                <Select name="currency" defaultValue="INR" disabled={isPending}>
                  <SelectTrigger className="h-14 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-bold">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black rounded-none font-bold">
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="font-bold text-base">Category</Label>
                <Select name="category" defaultValue="" disabled={isPending}>
                  <SelectTrigger className="h-14 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-bold">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black rounded-none font-bold">
                    <SelectItem value="Self Improvement">Self Improvement</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Business & Money">Business & Money</SelectItem>
                    <SelectItem value="Drawing & Painting">Drawing & Painting</SelectItem>
                    <SelectItem value="Software Development">Software Development</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-bold text-base">Initial Status</Label>
                <Select name="status" defaultValue="DRAFT" disabled={isPending}>
                  <SelectTrigger className="h-14 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black rounded-none font-bold">
                    <SelectItem value="DRAFT">Draft (Hidden)</SelectItem>
                    <SelectItem value="PUBLISHED">Published (Live)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary text-black h-16 px-12 text-xl font-black border-2 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-3"
          >
            {isPending && <Loader2 className="w-6 h-6 animate-spin" />}
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}