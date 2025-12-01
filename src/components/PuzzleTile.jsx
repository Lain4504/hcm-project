import React from "react";
import { cn } from "@/lib/utils";

// Hiển thị mảnh ảnh tương ứng với vị trí đúng (value) trong hình gốc
function PuzzleTile({ value, onClick, isMovable, image, gridSize = 3 }) {
  if (value === 0) {
    return <div aria-hidden="true" />;
  }

  const tileIndex = value - 1; // 1..9 -> 0..8
  const row = Math.floor(tileIndex / gridSize);
  const col = tileIndex % gridSize;

  const backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
  const backgroundPosition = `${
    (col / (gridSize - 1)) * 100
  }% ${(row / (gridSize - 1)) * 100}%`;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize,
        backgroundPosition,
      }}
      className={cn(
        "relative flex items-center justify-center rounded-[0.75rem] overflow-hidden",
        "bg-[#d32f2f] text-white text-2xl font-semibold",
        "shadow-[0_10px_25px_rgba(211,47,47,0.45)]",
        "transition-transform duration-150 ease-out active:scale-95",
        "border border-[#ffcc80]",
        isMovable
          ? "cursor-pointer hover:ring-2 hover:ring-[#ffeb3b]/80"
          : "cursor-default opacity-90"
      )}
    >
      {/* overlay mờ để chữ vẫn đọc được nhẹ nhàng */}
      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      {/* badge số thứ tự ở góc trên trái */}
      <span className="absolute left-2 top-2 z-10 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
        {value}
      </span>
    </button>
  );
}

export default PuzzleTile;


