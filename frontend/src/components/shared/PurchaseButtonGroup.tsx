import { LikeButton } from "@/components/shared/LikeButton";
import type { Product } from "@/types/Product";
import { useState } from "react";

type PurchaseButtonGroupProps = {
  likeCount: number;
  status: Product["status"];
  handlePurchase: () => void;
};

export function PurchaseButtonGroup({
  likeCount,
  status,
  handlePurchase,
}: PurchaseButtonGroupProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleToggleLike = (newLikeState: boolean) => {
    // TODO: APIを呼び出してlikeCountを更新する処理を追加する
    setIsLiked(newLikeState);
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex gap-2 items-center border-2 border-gray-300 rounded-lg py-2 px-4 cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => handleToggleLike(!isLiked)}
        onKeyDown={() => handleToggleLike(!isLiked)}
      >
        <LikeButton isLiked={isLiked} onToggleLike={handleToggleLike} />
        <span className="text-gray-500">{isLiked ? likeCount + 1 : likeCount}</span>
      </div>
      <button
        type="button"
        onClick={handlePurchase}
        disabled={status !== "available"}
        className={`flex-1 font-bold py-2 px-4 border-2 rounded-lg transition-colors ${
          status === "available"
            ? "bg-orange-500 border-orange-500 text-white hover:opacity-80 cursor-pointer"
            : "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {status === "available" ? "Purchase" : "Sold Out"}
      </button>
    </div>
  );
}
