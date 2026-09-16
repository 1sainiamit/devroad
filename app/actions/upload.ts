"use server";

import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Cloudinary config is automatically picked up from CLOUDINARY_URL in .env

const uploadToCloudinary = (buffer: Buffer, resourceType: "image" | "raw", originalFilename: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        resource_type: resourceType,
        folder: "devroad",
        use_filename: true,
        unique_filename: true,
        // Fallback filename for raw files
        public_id: originalFilename.replace(/\.[^/.]+$/, "") 
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload failed, no result returned"));
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

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

    // Convert the file to a Node.js Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const cloudinaryResourceType = uploadType === "COVER" ? "image" : "raw";
    const uploadResult = await uploadToCloudinary(buffer, cloudinaryResourceType, file.name);
    
    const fileUrl = uploadResult.secure_url;
    const storageKey = uploadResult.public_id; // Save public_id to delete it later

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
          storageKey: storageKey, // Cloudinary public_id
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

export async function updateProfileAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const name = (formData.get("name") as string)?.trim() || null;
    const bio = (formData.get("bio") as string)?.trim() || null;
    const avatarFile = formData.get("avatar") as File | null;

    let avatarUrl: string | undefined = undefined;

    if (avatarFile && avatarFile.size > 0) {
      if (!avatarFile.type.startsWith("image/")) {
        return { success: false, message: "Avatar must be an image file." };
      }
      if (avatarFile.size > 5 * 1024 * 1024) {
        return { success: false, message: "Avatar must be under 5 MB." };
      }
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const result = await uploadToCloudinary(buffer, "image", `avatar_${user.id}`);
      avatarUrl = result.secure_url;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        bio,
        ...(avatarUrl ? { avatarUrl } : {}),
      },
    });

    revalidatePath("/settings");
    revalidatePath("/dashboard");

    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, message: "Failed to update profile." };
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

    // Delete the physical file from Cloudinary
    await cloudinary.uploader.destroy(file.storageKey, { resource_type: "raw" });

    revalidatePath(`/products/${productId}/edit`);
    return { success: true, message: "File deleted" };
  } catch (error) {
    return { success: false, message: "Error deleting file" };
  }
}

