"use client";

import { useTransition } from "react";
import { Product, ProductFile } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, UploadCloud, Trash2, File as FileIcon, Image as ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadFileAction, deleteProductFileAction } from "@/app/actions/upload";
import { updateProduct } from "@/app/actions/products";

// Extended product type to include files
type ProductWithFiles = Product & { files: ProductFile[] };

export function EditorForm({ product }: { product: ProductWithFiles }) {
  const [isPending, startTransition] = useTransition();

  // Handlers for file uploads
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, uploadType: "COVER" | "FILE") => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (50MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 5MB.");
      event.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", product.id);
    formData.append("uploadType", uploadType);

    startTransition(async () => {
      const response = await uploadFileAction(formData);

      if (response.success) {
        toast.success(uploadType === "COVER" ? "Cover image updated!" : "File uploaded successfully!");
      } else {
        toast.error(response.message);
      }

      // Reset the input so you can upload the same file again if needed
      event.target.value = '';
    });
  };

  const handleDeleteFile = (fileId: string) => {
    startTransition(async () => {
      const response = await deleteProductFileAction(fileId, product.id);
      if (response.success) {
        toast.success("File deleted");
      } else {
        toast.error(response.message);
      }
    });
  };

  const handleUpdateDetails = (formData: FormData) => {
    const data = {
      name: formData.get("name") as string,
      price: formData.get("price") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string || "",
    };

    startTransition(async () => {
      const response = await updateProduct(product.id, data);
      if (response.success) {
        toast.success("Details updated successfully!");
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <div className="space-y-8 mt-8">
      {/* 1. Cover Image Section */}
      <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <CardHeader className="border-b-2 border-black bg-muted/30">
          <CardTitle className="font-black text-xl flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Cover Image
          </CardTitle>
          <CardDescription className="font-medium text-black/70">
            This image will be displayed on your storefront.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Display Current Image */}
            <div className="w-full sm:w-1/2 aspect-video bg-muted border-2 border-black rounded-none flex items-center justify-center relative overflow-hidden">
              {product.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.coverImageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="font-bold">No cover image</p>
                </div>
              )}
              {isPending && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-black" />
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="w-full sm:w-1/2">
              <Label
                htmlFor="cover-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-4 border-black border-dashed bg-white hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <p className="text-sm font-bold">Click to upload new cover</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">PNG, JPG, WEBP</p>
                </div>
                <Input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isPending}
                  onChange={(e) => handleFileUpload(e, "COVER")}
                />
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Digital Files Section */}
      <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="border-b-2 border-black bg-muted/30 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-black text-xl flex items-center gap-2">
              <FileIcon className="w-5 h-5" /> Digital Files
            </CardTitle>
            <CardDescription className="font-medium text-black/70">
              Customers will get access to these files after purchasing.
            </CardDescription>
          </div>
          <div>
            <Button asChild disabled={isPending} className="bg-black text-white hover:bg-black/90 font-bold border-2 border-transparent cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
              <Label htmlFor="file-upload">
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                Upload File
              </Label>
            </Button>
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              disabled={isPending}
              onChange={(e) => handleFileUpload(e, "FILE")}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {product.files.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <p className="font-bold text-lg">No files uploaded yet.</p>
              <p className="text-sm">Upload a PDF, ZIP, or video file to start selling.</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {product.files.map((file) => (
                <div key={file.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted border-2 border-black flex items-center justify-center">
                      <FileIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                      <p className="text-xs font-medium text-muted-foreground">
                        {(Number(file.sizeInBytes) / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFile(file.id)}
                    disabled={isPending}
                    className="text-destructive hover:bg-destructive hover:text-white rounded-none border-2 border-transparent hover:border-black"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Basic Info Section (Editable) */}
      <form action={handleUpdateDetails}>
        <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="border-b-2 border-black bg-muted/30">
            <CardTitle className="font-black text-xl flex items-center gap-2">
              Details
            </CardTitle>
            <CardDescription className="font-medium text-black/70">
              Update your product's name, price, and description.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold text-base">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={product.name}
                  required
                  disabled={isPending}
                  className="h-12 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-medium"
                />
              </div>
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
                    defaultValue={product.price}
                    required
                    disabled={isPending}
                    min="1"
                    className="h-12 pl-10 pr-4 text-xl border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold text-base">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={product.description || ""}
                required
                disabled={isPending}
                className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-medium min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="font-bold text-base">Category</Label>
              <Select name="category" defaultValue={product.category || ""} disabled={isPending}>
                <SelectTrigger className="h-12 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold">
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
            <div className="flex justify-end pt-4 border-t-2 border-black/10">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-black text-white h-12 px-8 font-bold border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] transition-all"
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
