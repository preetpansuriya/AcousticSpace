import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, LogIn, LogOut, CheckCircle2, Sparkles, Activity, KeyRound, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card3D } from './Card3D';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: { email?: string; isGuest?: boolean } | null;
  onLoginSuccess?: (email: string) => void;
  onLogout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout
}) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(email || 'analyst@acousticspace.io');
      }
      onClose();
    }, 800);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess('guest_forensic_analyst');
      }
      onClose();
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
        {/* Glowing Background Radial Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1.1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/20 rounded-full blur-[90px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 35 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -25 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="w-full max-w-md relative z-10"
        >
          <Card3D glowColor="cyan" className="p-6 space-y-6 relative overflow-hidden border border-cyan-500/40 shadow-2xl shadow-cyan-950/80 bg-slate-900/90 backdrop-blur-2xl">
            {/* Animated Biometric Laser Scan Line */}
            <motion.div
              animate={{ y: ['0%', '400%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 pointer-events-none shadow-[0_0_12px_#06b6d4]"
            />

            {/* Close button (only when already logged in) */}
            {currentUser && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Modal Header with animated audio equalizer */}
            <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-cyan-500/25 via-blue-600/20 to-indigo-600/20 text-cyan-400 border border-cyan-400/50 shadow-lg shadow-cyan-500/20">
                <Lock className="w-6 h-6 relative z-10" />
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="absolute inset-0 bg-cyan-400/30 rounded-2xl blur-md"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-1 rounded-2xl border border-dashed border-cyan-400/40"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-black text-white tracking-wide">
                    {currentUser ? 'Forensic Analyst Profile' : isSignUp ? 'Create Analyst Account' : 'Analyst Sign In'}
                  </h2>
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex space-x-0.5 items-end h-3"
                  >
                    <span className="w-0.5 h-full bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-0.5 h-2/3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-0.5 h-full bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </motion.div>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentUser ? 'Currently authenticated session' : 'Access secure acoustic logs & forensic export tools'}
                </p>
              </div>
            </div>

            {currentUser ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 text-center py-2"
              >
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold uppercase tracking-wider">Active Authenticated Analyst</p>
                  <p className="text-sm font-mono text-white font-extrabold">{currentUser.email || 'guest_forensic_analyst'}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (onLogout) onLogout();
                    onClose();
                  }}
                  className="w-full py-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-rose-950/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out Session</span>
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {/* Holographic Tab Switcher with Sliding Pill */}
                <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-white/10 relative">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className={`relative z-10 py-2 text-xs font-extrabold transition-colors flex items-center justify-center space-x-2 cursor-pointer ${
                      !isSignUp ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className={`relative z-10 py-2 text-xs font-extrabold transition-colors flex items-center justify-center space-x-2 cursor-pointer ${
                      isSignUp ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </button>

                  <motion.div
                    className="absolute inset-y-1 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-md shadow-cyan-500/30 border border-cyan-400/40"
                    initial={false}
                    animate={{
                      left: !isSignUp ? '4px' : '50%',
                      width: 'calc(50% - 4px)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.form
                    key={isSignUp ? 'signup' : 'signin'}
                    initial={{ opacity: 0, x: isSignUp ? 25 : -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isSignUp ? -25 : 25 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {isSignUp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                        <div className="relative group">
                          <User className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 absolute left-3 top-3 transition-colors" />
                          <input
                            type="text"
                            required
                            placeholder="Dr. Forensic Officer"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-white/15 text-xs text-white rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                          />
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Analyst Email</label>
                      <div className="relative group">
                        <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 absolute left-3 top-3 transition-colors" />
                        <input
                          type="email"
                          required
                          placeholder="analyst@acousticspace.io"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-white/15 text-xs text-white rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                      <div className="relative group">
                        <KeyRound className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 absolute left-3 top-3 transition-colors" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-white/15 text-xs text-white rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer border border-cyan-400/40 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 animate-spin text-cyan-300" />
                          <span>AUTHENTICATING SPECTROGRAM...</span>
                        </div>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          <span>{isSignUp ? 'Create Account & Sign In' : 'Sign In as Analyst'}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </>
                      )}
                    </motion.button>

                    <div className="relative my-4 text-center">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                      <span className="relative px-3 bg-slate-900 text-[10px] text-slate-400 font-mono tracking-widest uppercase">AUTHENTICATION LEVEL</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={handleGuestLogin}
                      className="w-full py-2.5 bg-slate-950/60 hover:bg-slate-800/80 text-slate-300 border border-white/15 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Continue as Anonymous Guest Analyst</span>
                    </motion.button>
                  </motion.form>
                </AnimatePresence>
              </div>
            )}
          </Card3D>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

