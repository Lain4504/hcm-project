import React from "react";
import { Button } from "@/components/ui/button";

function PuzzleCompleteCard({ image, puzzleInfo, steps, onRestart }) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl bg-gradient-to-br from-[#ffebee] via-white to-[#fff8e1] p-6 shadow-[0_25px_80px_rgba(183,28,28,0.7)] md:flex-row md:p-8">
      {/* Hình bên trái */}
      <div className="flex-1">
        <div className="overflow-hidden rounded-2xl border border-[#ffcdd2] bg-black/5 shadow-[0_16px_40px_rgba(244,67,54,0.45)]">
          <img
            src={image}
            alt={puzzleInfo?.title}
            className="h-full w-full max-h-[380px] object-cover"
          />
        </div>
      </div>

      {/* Card mô tả bên phải */}
      <div className="flex-1">
        <div className="flex h-full flex-col rounded-2xl border border-[#ef9a9a] bg-white/90 p-5 shadow-[0_18px_50px_rgba(198,40,40,0.55)]">
          <div className="mb-3 border-b border-[#ffcdd2] pb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f57f17]">
              Hoàn thành puzzle
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-[#b71c1c]">
              Mô tả về hình
            </h2>
          </div>

          <div className="space-y-3 text-sm text-[#4e342e]">
            <h3 className="text-base font-semibold text-[#c62828]">
              {puzzleInfo?.title}
            </h3>
            <p className="leading-relaxed">{puzzleInfo?.description}</p>

            <div className="mt-1 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-[#ffe082] bg-[#fff8e1]/80 p-3">
                <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-[#f57f17]">
                  Nguồn
                </p>
                <p className="mt-1 font-medium text-[#5d4037]">
                  {puzzleInfo?.source}
                </p>
              </div>
              <div className="rounded-xl border border-[#ffcdd2] bg-[#ffebee]/80 p-3">
                <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-[#c62828]">
                  Độ khó
                </p>
                <p className="mt-1 font-medium text-[#5d4037]">
                  {puzzleInfo?.difficulty}
                </p>
              </div>
            </div>

            <div className="mt-2 rounded-xl border border-dashed border-[#ef9a9a] bg-[#ffebee]/70 p-3 text-sm font-semibold text-[#b71c1c]">
              Bạn đã hoàn thành trong{" "}
              <span className="text-lg font-extrabold text-[#d32f2f]">
                {steps}
              </span>{" "}
              bước!
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button
              onClick={onRestart}
              className="rounded-full bg-[#d32f2f] px-6 py-2 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(183,28,28,0.75)] ring-2 ring-[#ffd54f] hover:bg-[#b71c1c] hover:shadow-[0_18px_55px_rgba(183,28,28,0.9)]"
            >
              Chơi lại
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PuzzleCompleteCard;


