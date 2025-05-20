import { useState } from "react";
import { FaHeart } from "react-icons/fa";

type LikeButtonProps = {
  isLiked?: boolean;
  onToggleLike?: (newState: boolean) => void;
};
export function LikeButton({ isLiked: externalLike, onToggleLike }: LikeButtonProps = {}) {
  const [internalLike, setInternalLike] = useState<boolean>(false);

  const like = externalLike !== undefined ? externalLike : internalLike;
  const confettiElements = new Array(10).fill(null);

  const handleLike = () => {
    const newLikeState = !like;
    setInternalLike(newLikeState);
    if (onToggleLike) {
      onToggleLike(newLikeState);
    }
  };
  return (
    <div className="relative">
      <style>{`
        .blink {
          animation: blinker 1s ease-in-out;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
        }

        .confetti:nth-child(1) {
          background-color: red;
          animation: move1 1s forwards;
        }
        .confetti:nth-child(2) {
          background-color: rgb(195, 15, 15);
          animation: move2 1s forwards;
        }
        .confetti:nth-child(3) {
          background-color: rgb(231, 59, 59);
          animation: move3 1s forwards;
        }
        .confetti:nth-child(4) {
          background-color: pink;
          animation: move4 1s forwards;
        }
        .confetti:nth-child(5) {
          background-color: rgb(128, 0, 0);
          animation: move5 1s forwards;
        }
        .confetti:nth-child(6) {
          background-color: rgb(138, 72, 72);
          animation: move6 1s forwards;
        }
        .confetti:nth-child(7) {
          background-color: rgb(169, 169, 169);
          animation: move7 1s forwards;
        }
        .confetti:nth-child(8) {
          background-color: rgb(127, 178, 183);
          animation: move8 1s forwards;
        }
        .confetti:nth-child(9) {
          background-color: rgb(103, 197, 131);
          animation: move9 1s forwards;
        }
        .confetti:nth-child(10) {
          background-color: rgb(185, 103, 197);
          animation: move10 1s forwards;
        }

        @keyframes blinker {
          0% { opacity: 0; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes move1 {
          0% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(-50%, 15px); opacity: 0; }
        }

        @keyframes move2 {
          0% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(-50%, -20px); opacity: 0; }
        }

        @keyframes move3 {
          0% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(15px, -50%); opacity: 0; }
        }

        @keyframes move4 {
          0% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(-18px, -50%); opacity: 0; }
        }

        @keyframes move5 {
          0% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(15px, 10px); opacity: 0; }
        }

        @keyframes move6 {
          0% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(-15px, -15px); opacity: 0; }
        }

        @keyframes move7 {
          0% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(15px, -15px); opacity: 0; }
        }

        @keyframes move8 {
          0% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(-15px, 10px); opacity: 0; }
        }

        @keyframes move9 {
          0% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(-18px, -15px); opacity: 0; }
        }

        @keyframes move10 {
          0% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(18px, -15px); opacity: 0; }
        }
      `}</style>

      {confettiElements.map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <div key={i} className={like ? "confetti" : ""} />
      ))}

      <button
        onClick={handleLike}
        aria-label={like ? "Delete from favorite" : "Add to favorite"}
        className="p-1 cursor-pointer w-full h-full flex items-center justify-center"
      >
        <FaHeart className={like ? "text-red-600 blink" : "text-gray-400"} size={20} />
      </button>
    </div>
  );
}
