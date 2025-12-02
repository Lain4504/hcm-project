import * as React from "react";
import { Button } from "./ui/button";
import { Volume2, Play, Pause } from "lucide-react";

interface TextToSpeechProps {
  text: string;
  title?: string;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, title }) => {
  const [isSupported, setIsSupported] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [rate, setRate] = React.useState(1);
  const [volume, setVolume] = React.useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = React.useState(false);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const volumeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const speedTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Kiểm tra browser có hỗ trợ Web Speech API không
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
    }

    // Dừng phát khi chuyển trang (beforeunload/pagehide)
    const handlePageHide = () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };

    window.addEventListener('beforeunload', handlePageHide);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      // Cleanup khi component unmount - Dừng phát ngay lập tức
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
        volumeTimeoutRef.current = null;
      }
      if (speedTimeoutRef.current) {
        clearTimeout(speedTimeoutRef.current);
        speedTimeoutRef.current = null;
      }

      // Remove event listeners
      window.removeEventListener('beforeunload', handlePageHide);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  // Dừng phát khi text hoặc title thay đổi (chuyển trang)
  React.useEffect(() => {
    // Dừng ngay lập tức khi text/title thay đổi
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentTime(0);
    setDuration(0);
  }, [text, title]);

  const estimateDuration = (text: string, rate: number) => {
    // Ước tính: ~150 từ/phút cho tiếng Việt ở tốc độ bình thường
    const words = text.split(/\s+/).length;
    const baseWordsPerMinute = 150;
    const adjustedWPM = baseWordsPerMinute * rate;
    return (words / adjustedWPM) * 60; // Convert to seconds
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSpeak = () => {
    if (!isSupported || !text) return;

    // Nếu đang pause, resume lại
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      if (intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setCurrentTime(prev => prev + 0.1);
        }, 100);
      }
      return;
    }

    // Nếu đang đọc, pause lại
    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Dừng bất kỳ utterance nào đang chạy
    window.speechSynthesis.cancel();

    // Tạo utterance mới
    const utterance = new SpeechSynthesisUtterance();

    // Kết hợp title và text
    const fullText = title ? `${title}. ${text}` : text;
    utterance.text = fullText;

    // Ước tính thời lượng
    const estimatedDuration = estimateDuration(fullText, rate);
    setDuration(estimatedDuration);
    setCurrentTime(0);

    // Cấu hình giọng đọc - volume luôn = 1, chúng ta sẽ control qua Audio API nếu cần
    utterance.lang = "vi-VN"; // Tiếng Việt
    utterance.rate = rate; // Tốc độ đọc
    utterance.pitch = 1; // Cao độ giọng (0 - 2)
    utterance.volume = 1; // Luôn để max, control bằng cách khác

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 0.1);
      }, 100);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentTime(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentTime(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    setShowSpeedMenu(false);

    // Nếu đang phát, áp dụng tốc độ mới ngay lập tức
    if (utteranceRef.current && (isSpeaking || isPaused)) {
      // Lưu lại trạng thái hiện tại
      const wasPlaying = isSpeaking;

      // Dừng phát hiện tại
      window.speechSynthesis.cancel();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Tạo utterance mới với tốc độ mới
      const utterance = new SpeechSynthesisUtterance();
      const fullText = title ? `${title}. ${text}` : text;
      utterance.text = fullText;
      utterance.lang = "vi-VN";
      utterance.rate = newRate;
      utterance.pitch = 1;
      utterance.volume = volume;

      // Ước tính lại thời lượng
      const estimatedDuration = estimateDuration(fullText, newRate);
      setDuration(estimatedDuration);

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        intervalRef.current = setInterval(() => {
          setCurrentTime(prev => prev + 0.1);
        }, 100);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentTime(0);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentTime(0);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };

      utteranceRef.current = utterance;

      // Chỉ phát lại nếu đang phát (không phải pause)
      if (wasPlaying) {
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPaused(false);
        setIsSpeaking(false);
      }
    }
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  if (!isSupported) {
    return null; // Không hiển thị nếu browser không hỗ trợ
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-red-200 bg-red-50/50 px-4 py-2.5">
      {/* Play/Pause Button */}
      <button
        onClick={handleSpeak}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition-all hover:bg-red-700 active:scale-95"
      >
        {isSpeaking ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </button>

      {/* Current Time */}
      <span className="text-sm font-medium text-red-600 min-w-[40px]">
        {formatTime(currentTime)}
      </span>

      {/* Progress Bar */}
      <div className="relative h-1.5 w-36 overflow-hidden rounded-full bg-red-200/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-100"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Duration */}
      <span className="text-sm font-medium text-red-600 min-w-[40px]">
        {formatTime(duration)}
      </span>

      {/* Volume Control */}
      <div
        className="relative"
        onMouseEnter={() => {
          if (volumeTimeoutRef.current) {
            clearTimeout(volumeTimeoutRef.current);
          }
          setShowVolumeSlider(true);
        }}
        onMouseLeave={() => {
          volumeTimeoutRef.current = setTimeout(() => {
            setShowVolumeSlider(false);
          }, 300);
        }}
      >
        <Volume2 className="h-5 w-5 text-gray-600 cursor-pointer transition-colors hover:text-red-600" />

        {/* Volume Slider Popup */}
        {showVolumeSlider && (
          <div
            className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 rounded-lg border border-red-200 bg-white p-3 shadow-xl"
            onMouseEnter={() => {
              if (volumeTimeoutRef.current) {
                clearTimeout(volumeTimeoutRef.current);
              }
              setShowVolumeSlider(true);
            }}
            onMouseLeave={() => {
              volumeTimeoutRef.current = setTimeout(() => {
                setShowVolumeSlider(false);
              }, 300);
            }}
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => {
                  const newVolume = Number(e.target.value) / 100;
                  setVolume(newVolume);
                  // Áp dụng volume ngay lập tức cho utterance đang phát
                  if (utteranceRef.current) {
                    utteranceRef.current.volume = newVolume;
                  }
                }}
                className="h-2 w-24 cursor-pointer appearance-none rounded-full"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${volume * 100}%, #fecaca ${volume * 100}%, #fecaca 100%)`
                }}
              />
              <span className="text-xs font-semibold text-red-600 min-w-[35px]">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Speed Control */}
      <div
        className="relative"
        onMouseEnter={() => {
          if (speedTimeoutRef.current) {
            clearTimeout(speedTimeoutRef.current);
          }
          setShowSpeedMenu(true);
        }}
        onMouseLeave={() => {
          speedTimeoutRef.current = setTimeout(() => {
            setShowSpeedMenu(false);
          }, 300);
        }}
      >
        <button className="rounded-lg border border-red-300 bg-white px-3 py-1 text-sm font-medium text-red-600 transition-all hover:bg-red-50">
          {rate}x
        </button>

        {/* Speed Options Menu */}
        {showSpeedMenu && (
          <div
            className="absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-lg border border-red-200 bg-white py-1 shadow-xl z-50"
            onMouseEnter={() => {
              if (speedTimeoutRef.current) {
                clearTimeout(speedTimeoutRef.current);
              }
              setShowSpeedMenu(true);
            }}
            onMouseLeave={() => {
              speedTimeoutRef.current = setTimeout(() => {
                setShowSpeedMenu(false);
              }, 300);
            }}
          >
            {speedOptions.map((speed) => (
              <button
                key={speed}
                onClick={() => handleRateChange(speed)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-red-50 ${speed === rate ? 'bg-red-100 font-semibold text-red-700' : 'text-gray-700'
                  }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
