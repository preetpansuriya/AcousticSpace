import React from 'react';
import { motion } from 'motion/react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber';
  maxTilt?: number;
  id?: string;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  id,
  onClick
}) => {
  const glowShadowMap = {
    cyan: 'hover:shadow-[0_20px_50px_-10px_rgba(6,182,212,0.3)] border-cyan-500/30 hover:border-cyan-400/60',
    purple: 'hover:shadow-[0_20px_50px_-10px_rgba(168,85,247,0.3)] border-purple-500/30 hover:border-purple-400/60',
    emerald: 'hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.3)] border-emerald-500/30 hover:border-emerald-400/60',
    rose: 'hover:shadow-[0_20px_50px_-10px_rgba(244,63,94,0.3)] border-rose-500/30 hover:border-rose-400/60',
    amber: 'hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.3)] border-amber-500/30 hover:border-amber-400/60',
  };

  return (
    <div className="w-full" id={id} onClick={onClick}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`relative rounded-3xl backdrop-blur-2xl bg-slate-900/85 border transition-all duration-300 shadow-2xl ${glowShadowMap[glowColor]} ${className}`}
      >
        {/* Cyberpunk Top Neon Rim Reflection Line */}
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-20" />

        {/* 3D Content Container */}
        <div className="w-full h-full relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

