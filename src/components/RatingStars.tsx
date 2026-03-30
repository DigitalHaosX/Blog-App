import { useState } from "react";
import { addRating } from "../services/ratingService";
import { useAuthContext } from "../auth/useAuthContext";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Chip } from "@heroui/react";

export default function RatingStars({ articleId }: { articleId: string }) {
  const [value, setValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuthContext();

  const handleRate = async (val: number) => {
    if (!user || submitted) return;
    setValue(val);
    setSubmitted(true);
    await addRating({ articleId, userId: user.uid, value: val });
  };

  const display = hoverValue || value;

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!user || submitted}
            onClick={() => handleRate(star)}
            onMouseEnter={() => !submitted && setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            className={`text-2xl transition-all duration-150 bg-transparent border-none outline-none p-0 ${
              star <= display ? "text-warning" : "text-default-300"
            } ${
              !user || submitted
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-125 cursor-pointer"
            }`}
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
          >
            {star <= display ? <FaStar /> : <FaRegStar />}
          </button>
        ))}
      </div>
      {submitted && (
        <Chip color="success" variant="flat" size="sm">
          ✓ Rated!
        </Chip>
      )}
      {!user && (
        <span className="text-default-400 text-xs">Sign in to rate</span>
      )}
    </div>
  );
}
