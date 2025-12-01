import type React from "react";

interface ARViewerProps {
  src: string;
  poster?: string;
  title?: string;
}

// Component hiển thị thẻ <model-viewer>. Script model-viewer sẽ được nạp ở trang AR.
export const ARViewer: React.FC<ARViewerProps> = ({ src, poster, title }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[color:var(--vn-red-soft)]/40 bg-[#050000]/90 shadow-[0_0_40px_rgba(139,0,0,0.5)]">
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


