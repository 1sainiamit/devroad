"use server";

import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function uploadFileAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;
    const uploadType = formData.get("uploadType") as "COVER" | "FILE"; // 'COVER' for image, 'FILE' for digital asset

    if (!file || !productId || !uploadType) {
      return { success: false, message: "Missing required fields" };
    }

    // Verify the user owns this product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.creatorId !== user.id) {
      return { success: false, message: "Unauthorized to edit this product" };
    }

    // Generate a unique filename to prevent overwriting
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const originalExtension = path.extname(file.name);
    const fileName = `${uniqueId}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    
    // Convert the file to a Node.js Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Write the file to the local public/uploads directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);
    
    // Ensure the directory exists (just in case)
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    if (uploadType === "COVER") {
      // Update the Product's cover image
      await prisma.product.update({
        where: { id: productId },
        data: { coverImageUrl: fileUrl },
      });
    } else {
      // Create a new ProductFile record for the digital asset
      await prisma.productFile.create({
        data: {
          productId,
          name: file.name,
          storageKey: fileUrl, // In local dev, the key is just the URL path
          sizeInBytes: file.size,
          contentType: file.type,
        },
      });
    }

    // Revalidate the product page so the UI updates
    revalidatePath(`/products/${productId}/edit`);

    return { 
      success: true, 
      message: "File uploaded successfully",
      url: fileUrl 
    };

  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: "Internal server error during upload" };
  }
}

export async function deleteProductFileAction(fileId: string, productId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.creatorId !== user.id) {
      return { success: false, message: "Unauthorized" };
    }

    const file = await prisma.productFile.findUnique({ where: { id: fileId } });
    if (!file || file.productId !== productId) {
      return { success: false, message: "File not found" };
    }

    // Delete the record from DB
    await prisma.productFile.delete({ where: { id: fileId } });

    // Optional: Delete the physical file from disk
    // const filePath = path.join(process.cwd(), "public", file.storageKey);
    // await fs.unlink(filePath).catch(() => {});

    revalidatePath(`/products/${productId}/edit`);
    return { success: true, message: "File deleted" };
  } catch (error) {
    return { success: false, message: "Error deleting file" };
  }
}
