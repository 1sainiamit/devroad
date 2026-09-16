"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { addReviewAction } from "@/app/actions/reviews";
import { useRouter } from "next/navigation";

interface RatingWidgetProps {
  productId: string;
  initialRating?: number;
  initialComment?: string | null;
}

export function RatingWidget({ productId, initialRating = 0, initialComment = "" }: RatingWidgetProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating first");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    const result = await addReviewAction(productId, rating, comment);
    
    if (result.success) {
      setIsSuccess(true);
      router.refresh();
      // Hide success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } else {
      setError(result.message);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="bg-[#f4f4f0] p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-xl font-black mb-4 text-black">Rate this product</h3>
      
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              className={`w-8 h-8 ${
                (hoverRating || rating) >= star
                  ? "fill-black text-black"
                  : "fill-transparent text-black/30"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-black">
          Review (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think about this product?"
          className="w-full p-3 border-2 border-black rounded-lg bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-black/20 min-h-[100px] resize-y"
        />
      </div>

      {error && <div className="text-red-500 font-bold mb-4">{error}</div>}
      
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || rating === 0}
        className="w-full bg-[#ff90e8] text-black font-black text-lg py-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isSuccess ? (
          "Saved!"
        ) : (
          "Submit Review"
        )}
      </button>
    </div>
  );
}
