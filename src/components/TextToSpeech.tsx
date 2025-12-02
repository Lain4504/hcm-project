import * as React from "react";
import { Button } from "./ui/button";
import { Volume2, VolumeX, Pause, Play, Square } from "lucide-react";

interface TextToSpeechProps {
  text: string;
  title?: string;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, title }) => {
  const [isSupported, setIsSupported] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    // Kiểm tra browser có hỗ trợ Web Speech API không
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
    }

    return () => {
      // Cleanup khi component unmount
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!isSupported || !text) return;

    // Nếu đang pause, resume lại
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    // Nếu đang đọc, dừng lại
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }

    // Tạo utterance mới
    const utterance = new SpeechSynthesisUtterance();
    
    // Kết hợp title và text
    const fullText = title ? `${title}. ${text}` : text;
    utterance.text = fullText;
    
    // Cấu hình giọng đọc
    utterance.lang = "vi-VN"; // Tiếng Việt
    utterance.rate = 0.9; // Tốc độ đọc (0.1 - 10)
    utterance.pitch = 1; // Cao độ giọng (0 - 2)
    utterance.volume = 1; // Âm lượng (0 - 1)

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (!isSpeaking || isPaused) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsSpeaking(false);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  if (!isSupported) {
    return null; // Không hiển thị nếu browser không hỗ trợ
  }

  return (
    <div className="flex items-center gap-2">
      {/* Nút Play/Stop chính */}
      <Button
        onClick={handleSpeak}
        size="sm"
        variant={isSpeaking || isPaused ? "default" : "outline"}
        className={
          isSpeaking || isPaused
            ? "border-[color:var(--vn-red-soft)] bg-[color:var(--vn-red-soft)] text-white hover:bg-[color:var(--vn-red-dark)]"
            : "border-[color:var(--vn-red-soft)]/40 bg-transparent text-[color:var(--vn-red-soft)] hover:bg-[color:var(--vn-red-soft)] hover:text-white"
        }
      >
        {isSpeaking ? (
          <>
            <VolumeX className="mr-2 h-4 w-4" />
            Dừng đọc
          </>
        ) : isPaused ? (
          <>
            <Play className="mr-2 h-4 w-4" />
            Tiếp tục
          </>
        ) : (
          <>
            <Volume2 className="mr-2 h-4 w-4" />
            Đọc văn bản
          </>
        )}
      </Button>

      {/* Nút Pause (chỉ hiện khi đang đọc) */}
      {isSpeaking && !isPaused && (
        <Button
          onClick={handlePause}
          size="sm"
          variant="outline"
          className="border-[color:var(--vn-yellow-soft)]/40 bg-transparent text-[color:var(--vn-yellow-soft)] hover:bg-[color:var(--vn-yellow-soft)] hover:text-black"
        >
          <Pause className="mr-2 h-4 w-4" />
          Tạm dừng
        </Button>
      )}

      {/* Nút Stop (chỉ hiện khi đang đọc hoặc pause) */}
      {(isSpeaking || isPaused) && (
        <Button
          onClick={handleStop}
          size="sm"
          variant="outline"
          className="border-red-500/40 bg-transparent text-red-500 hover:bg-red-500 hover:text-white"
        >
          <Square className="mr-2 h-4 w-4" />
          Dừng hẳn
        </Button>
      )}
    </div>
  );
};
