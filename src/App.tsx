import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { motion } from 'motion/react';
import { Terminal, Activity, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-black selection:bg-magenta selection:text-white">
      {/* Static Noise Overlay */}
      <div className="static-noise fixed inset-0 z-50 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-2"
        >
          <div className="flex items-center gap-4 text-magenta mb-2">
            <Cpu size={24} className="animate-pulse" />
            <div className="h-[2px] w-12 bg-magenta" />
            <Activity size={24} className="animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-cyan glitch-text" data-text="NEURAL_GRID">
            NEURAL_GRID
          </h1>
          <div className="flex items-center gap-2 text-magenta font-mono text-[10px] uppercase tracking-[0.5em] mt-2">
            <span>[PROTOCOL_VERSION_4.0.2]</span>
            <span className="animate-ping">●</span>
          </div>
        </motion.div>
      </header>

      {/* Main Content Grid */}
      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Terminal Info */}
        <div className="lg:col-span-3 hidden lg:flex flex-col gap-8">
          <div className="brutal-border p-6 bg-black">
            <div className="flex items-center gap-2 mb-6 text-cyan">
              <Terminal size={16} />
              <h2 className="text-xs font-bold uppercase tracking-widest">TERMINAL_LOG</h2>
            </div>
            <div className="space-y-4 font-mono text-[10px] text-cyan/60 leading-tight">
              <p className="text-magenta">&gt; INITIALIZING_CORE...</p>
              <p>&gt; MAPPING_INPUT_VECTORS</p>
              <p>&gt; SYNCING_AUDIO_STREAM</p>
              <p className="text-white/40">&gt; [WARNING] UNSTABLE_SIGNAL_DETECTED</p>
              <p>&gt; OVERRIDING_SAFETY_PROTOCOLS</p>
              <p className="text-cyan">&gt; SYSTEM_READY</p>
            </div>
          </div>

          <div className="brutal-border p-6 bg-black border-magenta/50">
            <div className="text-[10px] text-magenta font-mono leading-relaxed uppercase">
              "THE GRID IS A CONSTRUCT. REALITY IS A BUFFER. CONSUME DATA. EXTEND THE CHAIN."
            </div>
          </div>
        </div>

        {/* Center Column: Game */}
        <div className="lg:col-span-6 flex justify-center">
          <SnakeGame />
        </div>

        {/* Right Column: Music Player */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <MusicPlayer />
          
          <div className="brutal-border p-4 bg-black text-[9px] font-mono text-cyan/40 uppercase tracking-widest leading-loose">
            <div className="flex justify-between">
              <span>CPU_LOAD:</span>
              <span className="text-magenta">88%</span>
            </div>
            <div className="flex justify-between">
              <span>MEM_ALLOC:</span>
              <span className="text-cyan">4096KB</span>
            </div>
            <div className="flex justify-between">
              <span>UPTIME:</span>
              <span className="text-white">00:42:11</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-[1px] w-full max-w-xs bg-cyan/20" />
          <span className="text-[10px] font-mono text-cyan/20 uppercase tracking-[0.8em]">
            VOID_CONSTRUCT // NO_RIGHTS_RESERVED
          </span>
        </div>
      </footer>
    </div>
  );
}
