import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '@/src/constants';
import { Point, Direction } from '@/src/types';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const speedRef = useRef(INITIAL_SPEED);
  const lastUpdateTimeRef = useRef(0);

  const spawnFood = useCallback(() => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    foodRef.current = newFood;
  }, []);

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    spawnFood();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (directionRef.current !== 'DOWN') nextDirectionRef.current = 'UP';
        break;
      case 'ArrowDown':
        if (directionRef.current !== 'UP') nextDirectionRef.current = 'DOWN';
        break;
      case 'ArrowLeft':
        if (directionRef.current !== 'RIGHT') nextDirectionRef.current = 'LEFT';
        break;
      case 'ArrowRight':
        if (directionRef.current !== 'LEFT') nextDirectionRef.current = 'RIGHT';
        break;
      case ' ':
        if (!isGameOver) setIsPaused(prev => !prev);
        break;
      case 'r':
      case 'R':
        resetGame();
        break;
    }
  }, [isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const update = useCallback((time: number) => {
    if (isPaused || isGameOver) return;

    if (time - lastUpdateTimeRef.current < speedRef.current) {
      requestAnimationFrame(update);
      return;
    }

    lastUpdateTimeRef.current = time;
    directionRef.current = nextDirectionRef.current;

    const head = { ...snakeRef.current[0] };
    switch (directionRef.current) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setIsGameOver(true);
      return;
    }

    if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
      setIsGameOver(true);
      return;
    }

    const newSnake = [head, ...snakeRef.current];

    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(prev => {
        const newScore = prev + 10;
        if (newScore > highScore) setHighScore(newScore);
        return newScore;
      });
      speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREMENT);
      spawnFood();
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    requestAnimationFrame(update);
  }, [isPaused, isGameOver, highScore, spawnFood]);

  useEffect(() => {
    requestAnimationFrame(update);
  }, [update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const cellSize = canvas.width / GRID_SIZE;
      
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = '#00ffff22';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
      }

      // Draw food
      ctx.fillStyle = '#ff00ff';
      ctx.fillRect(
        foodRef.current.x * cellSize + 2,
        foodRef.current.y * cellSize + 2,
        cellSize - 4,
        cellSize - 4
      );

      // Draw snake
      snakeRef.current.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#00ffff' : '#00ffff88';
        
        ctx.fillRect(
          segment.x * cellSize + 1,
          segment.y * cellSize + 1,
          cellSize - 2,
          cellSize - 2
        );
      });

      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] px-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-cyan/40 font-mono">DATA_STREAM</span>
          <span className="text-3xl font-bold text-magenta font-mono">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-cyan/40 font-mono">MAX_CAPACITY</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-cyan font-mono">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      <div className="relative brutal-border">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black cursor-none"
        />

        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
            {isGameOver ? (
              <>
                <h2 className="text-5xl font-black text-magenta mb-2 uppercase italic tracking-tighter glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
                <p className="text-cyan/60 mb-6 font-mono text-sm uppercase">[RECOVERY_REQUIRED]</p>
                <button 
                  onClick={resetGame}
                  className="brutal-button bg-magenta text-black text-xl"
                >
                  REBOOT_SYSTEM
                </button>
              </>
            ) : (
              <>
                <h2 className="text-5xl font-black text-cyan mb-6 uppercase italic tracking-tighter">STANDBY_MODE</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="brutal-button bg-cyan text-black text-xl"
                >
                  INITIALIZE
                </button>
                <p className="mt-4 text-[10px] text-magenta font-mono uppercase tracking-widest">[PRESS_SPACE_TO_RESUME]</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 text-[10px] font-mono text-cyan/30 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 border border-cyan/20">INPUT_VECTORS</span>
          <span>ARROWS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 border border-cyan/20">INTERRUPT</span>
          <span>SPACE</span>
        </div>
      </div>
    </div>
  );
}
