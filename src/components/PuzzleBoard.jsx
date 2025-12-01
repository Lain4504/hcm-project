import React, { useEffect, useState } from "react";
import PuzzleTile from "./PuzzleTile";
import PuzzlePreview from "./PuzzlePreview";
import PuzzleCompleteCard from "./PuzzleCompleteCard";

const GRID_SIZE = 3;
const GOAL_STATE = "123456780";

function generateSolvedTiles() {
  return [1, 2, 3, 4, 5, 6, 7, 8, 0];
}

function getNeighbors(index, size) {
  const row = Math.floor(index / size);
  const col = index % size;
  const neighbors = [];

  if (row > 0) neighbors.push(index - size); // up
  if (row < size - 1) neighbors.push(index + size); // down
  if (col > 0) neighbors.push(index - 1); // left
  if (col < size - 1) neighbors.push(index + 1); // right

  return neighbors;
}

// Tạo puzzle solvable bằng cách random từ trạng thái đã giải,
// thực hiện nhiều lần các nước đi hợp lệ.
function generateSolvablePuzzle() {
  let tiles = generateSolvedTiles();
  let emptyIndex = tiles.indexOf(0);

  const shuffleMoves = 80;

  for (let i = 0; i < shuffleMoves; i++) {
    const neighbors = getNeighbors(emptyIndex, GRID_SIZE);
    const randomNeighbor =
      neighbors[Math.floor(Math.random() * neighbors.length)];

    const newTiles = [...tiles];
    [newTiles[emptyIndex], newTiles[randomNeighbor]] = [
      newTiles[randomNeighbor],
      newTiles[emptyIndex],
    ];

    tiles = newTiles;
    emptyIndex = randomNeighbor;
  }

  return { tiles, emptyIndex };
}

function PuzzleBoard({ puzzleInfo, image }) {
  const [tiles, setTiles] = useState([]);
  const [steps, setSteps] = useState(0);
  const [emptyIndex, setEmptyIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    restartGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restartGame = () => {
    const { tiles: shuffledTiles, emptyIndex: initialEmpty } =
      generateSolvablePuzzle();
    setTiles(shuffledTiles);
    setEmptyIndex(initialEmpty);
    setSteps(0);
    setIsCompleted(false);
  };

  const handleTileClick = (index) => {
    if (isCompleted) return;

    const neighbors = getNeighbors(emptyIndex, GRID_SIZE);
    if (!neighbors.includes(index)) return;

    const newTiles = [...tiles];
    [newTiles[emptyIndex], newTiles[index]] = [
      newTiles[index],
      newTiles[emptyIndex],
    ];

    setTiles(newTiles);
    setEmptyIndex(index);
    setSteps((prev) => prev + 1);

    if (newTiles.join("") === GOAL_STATE) {
      setIsCompleted(true);
    }
  };

  const renderGrid = () => {
    return (
      <div
        className="grid aspect-square w-full max-w-md grid-cols-3 gap-3 rounded-3xl border border-border bg-[color:var(--card)] p-4 shadow-[0_18px_40px_rgba(139,0,0,0.18)]"
        aria-label="Puzzle xếp hình 3x3"
      >
        {tiles.map((value, idx) => {
          const isMovable = getNeighbors(emptyIndex, GRID_SIZE).includes(idx);
          return (
            <PuzzleTile
              key={idx}
              value={value}
              isMovable={isMovable}
              image={image}
              gridSize={GRID_SIZE}
              onClick={() => handleTileClick(idx)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:gap-10">
      {/* Thanh stats */}
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[color:var(--vn-red-soft)]/80">
            Mini-game lịch sử Việt Nam
          </p>
          <p className="text-sm text-muted-foreground max-w-xl">
            Nhấn vào các ô nằm cạnh ô trống để di chuyển mảnh ghép và hoàn thành bức tranh.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-[color:var(--card)] px-4 py-2 text-sm shadow-sm">
          <div className="flex flex-col text-right">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--vn-red-soft)]/80">
              Số bước
            </span>
            <span className="text-2xl font-extrabold text-[color:var(--vn-red-soft)]">
              {steps}
            </span>
          </div>
          <span className="h-10 w-px bg-gradient-to-b from-[color:var(--vn-red-soft)]/20 via-border to-transparent" />
          <div className="flex flex-col text-right">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--vn-red-soft)]/80">
              Trạng thái
            </span>
            <span className="text-sm font-semibold text-[color:var(--vn-red-dark)]">
              {isCompleted ? "Đã hoàn thành" : "Đang chơi"}
            </span>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      {isCompleted ? (
        <PuzzleCompleteCard
          image={image}
          puzzleInfo={puzzleInfo}
          steps={steps}
          onRestart={restartGame}
        />
      ) : (
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
          {/* Lưới puzzle */}
          {renderGrid()}

          {/* Thông tin & xem mẫu (ẩn nội dung chi tiết cho đến khi hoàn thành) */}
          <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-border bg-[color:var(--card)] p-4 shadow-sm">
            <div className="rounded-xl border border-border bg-[color:var(--background)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--vn-red-soft)]/85">
                Bức hình
              </p>
              <h2 className="mt-1 text-lg font-bold text-[color:var(--vn-red-soft)]">
                Hình ảnh lịch sử sẽ được mở khoá
              </h2>
              <p className="mt-2 text-xs text-muted-foreground">
                Hoàn thành puzzle để xem đầy đủ tiêu đề và mô tả chi tiết về bức ảnh này.
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-[color:var(--secondary)]/60 p-3 text-xs text-[color:var(--foreground)]">
              <p className="font-semibold text-[color:var(--vn-red-soft)]">
                Luật chơi nhanh:
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                <li>Chỉ có thể di chuyển mảnh ghép nằm cạnh ô trống.</li>
                <li>Sắp xếp các mảnh để khớp lại bức ảnh hoàn chỉnh.</li>
                <li>Cố gắng hoàn thành với số bước ít nhất.</li>
              </ul>
            </div>

            <PuzzlePreview image={image} title={puzzleInfo?.title} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PuzzleBoard;


