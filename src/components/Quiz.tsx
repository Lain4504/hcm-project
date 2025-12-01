import type React from "react";
import { useState } from "react";
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

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const total = questions.length;
  const q = questions[current];

  const handleSelect = (index: number) => {
    setSelected(index);
  };

  const handleNext = () => {
    if (selected === null) return;

    const nextAnswers = [...answers];
    nextAnswers[current] = selected;
    setAnswers(nextAnswers);

    if (current === total - 1) {
      setShowResult(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
  };

  const score = answers.reduce((acc, ans, idx) => {
    if (ans === questions[idx].correctIndex) return acc + 1;
    return acc;
  }, 0);

  if (!questions.length) {
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
            <div className="space-y-3 text-sm text-[color:var(--body)]">
              <p>
                Bạn trả lời đúng{" "}
                <span className="font-semibold text-[color:var(--vn-red-soft)]">
                  {score}/{total}
                </span>{" "}
                câu hỏi.
              </p>
              <p>
                Hãy tiếp tục khám phá Timeline và tài liệu để hiểu sâu hơn về chiến dịch Điện Biên Phủ lừng lẫy năm
                châu, chấn động địa cầu.
              </p>
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

                  if (isSelected && isCorrect) {
                    stateClasses =
                      "border-[color:var(--vn-yellow-dark)] bg-[color:var(--vn-yellow-soft)] text-[#3A1A00]";
                  } else if (isSelected && !isCorrect) {
                    stateClasses =
                      "border-[color:var(--vn-red-light)] bg-[color-mix(in_srgb,var(--vn-red-light) 15%,#ffffff 85%)] text-[color:var(--body)]";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(idx)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${stateClasses}`}
                    >
                      <span className="font-medium text-xs text-[color:var(--vn-red-soft)]">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="ml-2 flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
              {selected !== null && (
                <p className="mt-1 text-[0.75rem] text-[color:var(--text-secondary)]">
                  {selected === q.correctIndex
                    ? "Chính xác! Bạn đang đi đúng hướng trong việc hiểu tư tưởng Hồ Chí Minh."
                    : q.explanation || "Hãy suy nghĩ lại dựa trên nội dung môn HCM202 bạn vừa học."}
                </p>
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
              onClick={() => {
                if (current === 0) return;
                setCurrent((c) => c - 1);
                setSelected(answers[current - 1] ?? null);
              }}
            >
              Quay lại
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            {showResult ? (
              <Button size="sm" variant="outline" onClick={handleRestart}>
                Chơi lại
              </Button>
            ) : (
              <Button size="sm" onClick={handleNext} disabled={selected === null}>
                {current === total - 1 ? "Xem kết quả" : "Câu tiếp theo"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};


