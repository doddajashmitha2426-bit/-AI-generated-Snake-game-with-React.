import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SONGS } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = SONGS[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSongIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    setProgress(0);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  return (
    <div className="brutal-border p-6 w-full max-w-md flex flex-col gap-4 bg-black relative overflow-hidden">
      <div className="static-noise absolute inset-0 z-0" />
      
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-4 relative z-10">
        <motion.div 
          key={currentSong.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative w-24 h-24 border-2 border-magenta overflow-hidden flex-shrink-0"
        >
          <img 
            src={currentSong.cover} 
            alt={currentSong.title} 
            className="w-full h-full object-cover grayscale contrast-150"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-cyan/20 mix-blend-screen">
              <div className="flex gap-1 items-end h-8">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 28, 8, 32, 4] }}
                    transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.05 }}
                    className="w-1 bg-magenta"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold truncate text-cyan glitch-text" data-text={currentSong.title}>{currentSong.title}</h3>
          <p className="text-sm text-magenta truncate tracking-widest uppercase">{currentSong.artist}</p>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-cyan/60 font-mono">
            <Music size={10} />
            <span>[SIGNAL_DETECTED]</span>
          </div>
        </div>
      </div>

      <div className="space-y-1 relative z-10">
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-crosshair"
        />
        <div className="flex justify-between text-[10px] font-mono text-magenta">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '00:00'}</span>
          <span>{audioRef.current ? formatTime(audioRef.current.duration) : '00:00'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="brutal-button p-2">
            <SkipBack size={16} />
          </button>
          <button 
            onClick={togglePlay} 
            className="brutal-button p-3 bg-cyan text-black"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button onClick={handleNext} className="brutal-button p-2">
            <SkipForward size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 w-24">
          <Volume2 size={14} className="text-cyan" />
          <Slider
            value={[volume * 100]}
            max={100}
            onValueChange={(v) => setVolume(v[0] / 100)}
            className="cursor-crosshair"
          />
        </div>
      </div>
      
      <div className="text-[8px] text-cyan/30 font-mono mt-2 uppercase tracking-tighter">
        LOG_ID: {Math.random().toString(36).substring(7).toUpperCase()} // BUFFER_STATUS: OK
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
