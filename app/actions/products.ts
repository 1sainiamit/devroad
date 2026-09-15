"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  const user = await getCurrentUser();
  if (!user?.id) {
    return {
      success: false,
      message: "Unauthorized",
      data: null,
    };
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        creatorId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "Products fetched successfully",
      data: products,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to fetch products",
      data: null,
    };
  }
}

type CreateProductInput = {
  name: string;
  description: string;
  priceInCents: string;
  currency?: string;
  status: "DRAFT" | "PUBLISHED";
};

export async function createProduct(data: CreateProductInput) {
  const user = await getCurrentUser();
  
  if (!user?.id) {
    return { success: false, message: "Unauthorized", data: null };
  }

  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description,
        priceInCents: parseInt(data.priceInCents, 10),
        currency: data.currency || "USD",
        status: data.status,
        creatorId: user.id,
      },
    });

    return {
      success: true,
      message: "Product created successfully",
      data: product,
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message: "Failed to create product. The name might already be taken.",
      data: null,
    };
  }
}

type UpdateProductInput = {
  name: string;
  description: string;
  priceInCents: string;
};

export async function updateProduct(productId: string, data: UpdateProductInput) {
  const user = await getCurrentUser();
  
  if (!user?.id) {
    return { success: false, message: "Unauthorized", data: null };
  }

  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const product = await prisma.product.update({
      where: {
        id: productId,
        creatorId: user.id // Security: ensure they own the product they are updating!
      },
      data: {
        name: data.name,
        slug: slug,
        description: data.description,
        priceInCents: parseInt(data.priceInCents, 10),
      },
    });

    revalidatePath(`/products/${productId}/edit`);

    return {
      success: true,
      message: "Product updated successfully",
      data: product,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: "Failed to update product.",
      data: null,
    };
  }
}

export async function togglePublishStatus(productId: string) {
  const user = await getCurrentUser();
  if (!user?.id) return { success: false, message: "Unauthorized" };

  try {
    const product = await prisma.product.findFirst({
      where: { id: productId, creatorId: user.id },
    });

    if (!product) return { success: false, message: "Product not found" };

    const newStatus = product.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    await prisma.product.update({
      where: { id: productId },
      data: { status: newStatus },
    });

    revalidatePath(`/products/${productId}/edit`);
    revalidatePath(`/products`);

    return { success: true, message: `Product ${newStatus}` };
  } catch (error) {
    console.error("Error toggling publish status:", error);
    return { success: false, message: "Failed to update status" };
  }
}