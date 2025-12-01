import type React from "react";

interface ARViewerProps {
  src: string;
  poster?: string;
  title?: string;
}

// Component hiển thị thẻ <model-viewer>. Script model-viewer sẽ được nạp ở trang AR.
export const ARViewer: React.FC<ARViewerProps> = ({ src, poster, title }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-100/70 bg-slate-950/80 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
      <model-viewer
        src={src}
        poster={poster}
        alt={title || "Mô hình 3D Điện Biên Phủ"}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        touch-action="pan-y"
        environment-image="neutral"
        exposure="1.1"
        auto-rotate
        style={{ width: "100%", height: "360px", backgroundColor: "transparent" }}
      />
    </div>
  );
};


