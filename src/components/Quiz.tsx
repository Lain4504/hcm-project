import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

type QuizQuestion = {
  id: number;
  question: string;
  image?: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

interface QuizProps {
  questions: QuizQuestion[];
}

// Hàm shuffle mảng (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
  // Shuffle câu hỏi ngay từ đầu (chỉ 1 lần khi component mount)
  const [shuffledQuestions] = useState(() => shuffleArray(questions));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const total = shuffledQuestions.length;
  const q = shuffledQuestions[current];

  const isAnsweredAndSaved = answers[current] !== undefined;
  const hasAnswered = selected !== null;
  const isTimedOut = answers[current] === -1;

  useEffect(() => {
    if (showResult || hasAnswered || isAnsweredAndSaved) return;

    setTimeLeft(30);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [current, showResult, hasAnswered, isAnsweredAndSaved]);

  const handleTimeOut = () => {
    if (answers[current] === undefined) {
      const updatedAnswers = [...answers];
      updatedAnswers[current] = -1;
      setAnswers(updatedAnswers);
    }
  };

  const handleSelect = (index: number) => {
    if (selected !== null || isTimedOut) return;
    setSelected(index);
  };

  const handleNext = () => {
    if (selected === null && !isTimedOut) return;

    let updatedAnswers = answers;
    if (answers[current] === undefined && selected !== null) {
      updatedAnswers = [...answers];
      updatedAnswers[current] = selected;
      setAnswers(updatedAnswers);
    }

    if (current === total - 1) {
      setShowResult(true);
    } else {
      const nextIndex = current + 1;
      setCurrent(nextIndex);
      setSelected(updatedAnswers[nextIndex] !== undefined && updatedAnswers[nextIndex] !== -1 ? updatedAnswers[nextIndex] : null);
      setTimeLeft(30);
    }
  };

  const handlePrevious = () => {
    if (current === 0) return;

    let updatedAnswers = answers;
    if (selected !== null && answers[current] === undefined) {
      updatedAnswers = [...answers];
      updatedAnswers[current] = selected;
      setAnswers(updatedAnswers);
    }

    const prevIndex = current - 1;
    setCurrent(prevIndex);
    setSelected(updatedAnswers[prevIndex] !== undefined && updatedAnswers[prevIndex] !== -1 ? updatedAnswers[prevIndex] : null);
  };

  const handleRestart = () => {
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(30);
  };

  const score = answers.reduce((acc, ans, idx) => {
    if (ans !== undefined && ans !== -1 && ans === shuffledQuestions[idx].correctIndex) return acc + 1;
    return acc;
  }, 0);

  if (!shuffledQuestions.length) {
    return <p className="text-sm text-muted-foreground">Chưa có câu hỏi nào.</p>;
  }

  const progressValue = showResult ? 100 : ((current + 1) / total) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-border bg-card backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--vn-yellow-soft)]">
                Game HCM202
              </p>
              <CardTitle className="mt-2 text-lg md:text-xl">
                {showResult ? "Kết quả thử thách" : `Câu hỏi ${current + 1}/${total}`}
              </CardTitle>
            </div>
            <div className="flex flex-col items-end text-xs text-[color:var(--text-secondary)]">
              {!showResult && (
                <div className={`mb-2 flex items-center gap-1 text-lg font-bold ${isTimedOut ? 'text-gray-400' : timeLeft <= 10 ? 'text-red-500' : 'text-[color:var(--vn-yellow-soft)]'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{isTimedOut ? 'Hết giờ' : `${timeLeft}s`}</span>
                </div>
              )}
              <span className="font-semibold">Điểm hiện tại</span>
              <span>
                {score}/{total}
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <Progress value={progressValue} className="h-1.5" />
            {!showResult && (
              <p className="text-[0.7rem] text-[color:var(--text-secondary)]">
                Tiến độ {current + 1}/{total} câu hỏi
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 quiz-slide-enter">
          {showResult ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--vn-yellow-soft)] to-[color:var(--vn-red-soft)]">
                <span className="text-4xl font-bold text-white">{score}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[color:var(--heading)]">
                  {score === total ? "Xuất sắc!" : score >= total * 0.7 ? "Tốt lắm!" : score >= total * 0.5 ? "Cố gắng hơn!" : "Hãy học thêm nhé!"}
                </h3>
                <p className="text-sm text-[color:var(--body)]">
                  Bạn đã trả lời đúng{" "}
                  <span className="font-semibold text-[color:var(--vn-red-soft)]">
                    {score}/{total}
                  </span>{" "}
                  câu hỏi
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm text-[color:var(--text-secondary)]">
                  {score === total
                    ? "Tuyệt vời! Bạn đã nắm vững kiến thức về tư tưởng Hồ Chí Minh."
                    : "Hãy tiếp tục khám phá Timeline và tài liệu để hiểu sâu hơn về hành trình tư tưởng Hồ Chí Minh và con đường độc lập dân tộc gắn với chủ nghĩa xã hội."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <p className="text-sm font-medium text-[color:var(--heading)] md:text-base">{q.question}</p>
                {q.image && (
                  <div className="overflow-hidden rounded-xl border border-border bg-muted">
                    <img
                      src={q.image}
                      alt={q.question}
                      className="max-h-52 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                {q.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const isCorrect = idx === q.correctIndex;

                  let stateClasses =
                    "border-border bg-white hover:border-[color:var(--vn-red-soft)]/60 hover:bg-[color-mix(in_srgb,var(--vn-red-light) 8%,#ffffff 92%)]";
                  let labelColor = "text-[color:var(--vn-red-soft)]";

                  if (hasAnswered) {
                    if (isSelected && isCorrect) {
                      stateClasses = "border-green-500 bg-green-50 text-green-900";
                      labelColor = "text-green-700";
                    } else if (isSelected && !isCorrect) {
                      stateClasses = "border-red-500 bg-red-50 text-red-900";
                      labelColor = "text-red-700";
                    } else {
                      stateClasses = "border-border bg-gray-50 text-gray-500";
                      labelColor = "text-gray-400";
                    }
                  } else if (isTimedOut) {
                    stateClasses = "border-border bg-gray-50 text-gray-500";
                    labelColor = "text-gray-400";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(idx)}
                      disabled={hasAnswered || isTimedOut}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${stateClasses} ${(hasAnswered || isTimedOut) ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span className={`font-medium text-xs ${labelColor}`}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="ml-2 flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
              {isTimedOut && (
                <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
                  <p className="font-semibold text-sm mb-1 text-orange-700">
                    ⏱ Hết giờ!
                  </p>
                  <p className="text-[0.75rem] text-orange-600">
                    Bạn đã không trả lời câu hỏi này trong thời gian quy định. Đáp án đúng là: <span className="font-semibold">{q.options[q.correctIndex]}</span>. {q.explanation || "Hãy xem lại nội dung môn HCM202 để hiểu rõ hơn."}
                  </p>
                </div>
              )}
              {selected !== null && !isTimedOut && (
                <div className={`mt-3 rounded-lg border p-3 ${selected === q.correctIndex
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
                  }`}>
                  <p className={`font-semibold text-sm mb-1 ${selected === q.correctIndex ? 'text-green-700' : 'text-red-700'
                    }`}>
                    {selected === q.correctIndex ? '✓ Đúng rồi!' : '✗ Sai rồi!'}
                  </p>
                  <p className={`text-[0.75rem] ${selected === q.correctIndex ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {selected === q.correctIndex
                      ? q.explanation || "Chính xác! Bạn đang đi đúng hướng trong việc hiểu tư tưởng Hồ Chí Minh."
                      : <>Đáp án đúng là: <span className="font-semibold">{q.options[q.correctIndex]}</span>. {q.explanation || "Hãy xem lại nội dung môn HCM202 để hiểu rõ hơn về tư tưởng Hồ Chí Minh."}</>}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!showResult && (
            <Button
              size="sm"
              variant="outline"
              disabled={current === 0}
              onClick={handlePrevious}
            >
              Quay lại
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            {showResult ? (
              <Button size="sm" onClick={handleRestart}>
                Làm lại
              </Button>
            ) : (
              <Button size="sm" onClick={handleNext} disabled={!hasAnswered && !isTimedOut}>
                {current === total - 1 ? "Xem kết quả" : "Câu tiếp theo"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};


