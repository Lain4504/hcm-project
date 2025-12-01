import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function PuzzlePreview({ image, title }) {
  return (
    <Dialog>
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-[#d32f2f] bg-black/5 p-1 shadow-sm">
          <img
            src={image}
            alt={title}
            className="h-16 w-16 rounded-lg object-cover"
          />
        </div>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-[#d32f2f] bg-[#ffebee] px-4 py-2 text-sm font-semibold text-[#b71c1c] shadow-[0_0_18px_rgba(255,215,0,0.35)] hover:bg-[#ffcdd2] hover:text-[#7f0000]"
          >
            Xem mẫu
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-lg border border-[#ffcdd2] bg-gradient-to-br from-[#ffebee] via-white to-[#fff8e1] text-[#3e2723] shadow-[0_22px_60px_rgba(183,28,28,0.65)]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#b71c1c]">
            Mẫu hoàn chỉnh
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <img
            src={image}
            alt={title}
            className="w-full rounded-xl shadow-md"
          />
          <p className="mt-3 text-sm text-[#5d4037]">
            Hãy quan sát kỹ bức hình mẫu và thử sắp xếp lại các mảnh ghép để
            tạo nên bức tranh hoàn chỉnh!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PuzzlePreview;


