"use server";

import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addReviewAction(productId: string, rating: number, comment?: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, message: "Rating must be between 1 and 5" };
    }

    // Verify the user actually purchased the product
    const purchase = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          buyerId: user.id,
          status: "PAID"
        }
      }
    });

    if (!purchase) {
      return { success: false, message: "You must purchase this product to review it." };
    }

    // Create or update the review
    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      },
      update: {
        rating,
        comment
      },
      create: {
        userId: user.id,
        productId,
        rating,
        comment
      }
    });

    // Recalculate average rating for the product
    const allReviews = await prisma.review.findMany({
      where: { productId }
    });

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;

    // Update the product
    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating,
        reviewCount: allReviews.length
      }
    });

    // Revalidate relevant pages
    revalidatePath("/discover");
    revalidatePath(`/${productId}`); // Assuming the product slug page
    revalidatePath(`/library/${productId}`);

    return { success: true, message: "Review submitted successfully" };
  } catch (error) {
    console.error("Review error:", error);
    return { success: false, message: "Failed to submit review" };
  }
}
