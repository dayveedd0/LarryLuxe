import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, AlertCircle, Scissors, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useTailorStore } from '../store/useTailorStore';


interface PasscodeLockProps {
  onUnlocked?: () => void;
}

export const PasscodeLock: React.FC<PasscodeLockProps> = ({ onUnlocked }) => {
  const { unlockApp, masterPasscode } = useTailorStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTextMode, setIsTextMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Expected PIN length
  const pinLength = masterPasscode.length || 4;

  const handleDigit = (digit: string) => {
    if (pin.length < pinLength) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === pinLength) {
        // Auto verify
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const verifyPin = (candidate: string) => {
    const success = unlockApp(candidate);
    if (success) {
      onUnlocked?.();
    } else {
      setIsShaking(true);
      setError(true);
      setErrorMessage('Incorrect passcode. Please try again.');
      setTimeout(() => {
        setPin('');
        setIsShaking(false);
      }, 700);
    }
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    verifyPin(pin);
  };

  // Listen to physical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTextMode) return;
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isTextMode, masterPasscode]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#0F0E0C] via-[#161512] to-[#0A0908] text-white relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Lock Card */}
      <div 
        className={`w-full max-w-sm relative z-10 glass-panel border border-gold-500/25 rounded-3xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-2xl transition-transform duration-200 ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Atelier Crest Logo */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 p-0.5 shadow-gold-glow mb-4 flex items-center justify-center">
          <div className="w-full h-full bg-[#1C1B18] rounded-[14px] flex items-center justify-center overflow-hidden p-2">
            <img
              src="/assets/logo-icon.png"
              alt="Larré Luxe Crest"
              className="w-full h-full object-contain filter drop-shadow"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Scissors className="w-8 h-8 text-gold-400 hidden group-has-[img:hidden]:block" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
          <span className="gold-gradient-text">Larré Luxe</span>
        </h1>
        <p className="font-script text-lg text-gold-400/90 mb-6">
          Haute Couture Atelier
        </p>

        {/* Status prompt */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 mb-6 uppercase tracking-wider font-medium">
          <Lock className="w-3.5 h-3.5 text-gold-400" />
          <span>Atelier Passcode Protected</span>
        </div>

        {!isTextMode ? (
          <>
            {/* PIN Dots Indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {Array.from({ length: pinLength }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    i < pin.length
                      ? 'bg-gradient-to-r from-gold-400 to-amber-500 scale-125 shadow-gold-glow ring-2 ring-gold-400/40'
                      : error
                      ? 'bg-red-500/40 border border-red-500/60'
                      : 'bg-white/10 border border-gold-500/20'
                  }`}
                />
              ))}
            </div>

            {/* Numeric Keypad (Apple HIG aesthetic) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-3.5 max-w-[260px] mx-auto mb-6">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigit(digit)}
                  className="w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-full bg-white/5 hover:bg-white/15 active:bg-gold-500/30 border border-gold-500/20 hover:border-gold-400/50 text-xl sm:text-2xl font-serif font-medium text-white transition-all duration-150 flex items-center justify-center btn-press shadow-sm"
                >
                  {digit}
                </button>
              ))}
              
              {/* Clear */}
              <button
                onClick={handleClear}
                className="w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-full bg-transparent hover:bg-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-all flex items-center justify-center btn-press"
              >
                Clear
              </button>

              {/* 0 */}
              <button
                onClick={() => handleDigit('0')}
                className="w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-full bg-white/5 hover:bg-white/15 active:bg-gold-500/30 border border-gold-500/20 hover:border-gold-400/50 text-xl sm:text-2xl font-serif font-medium text-white transition-all duration-150 flex items-center justify-center btn-press shadow-sm"
              >
                0
              </button>

              {/* Backspace */}
              <button
                onClick={handleDelete}
                className="w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-full bg-transparent hover:bg-white/10 text-neutral-400 hover:text-gold-400 transition-all flex items-center justify-center btn-press"
              >
                <span className="text-sm font-semibold tracking-wide">⌫</span>
              </button>
            </div>
          </>
        ) : (
          /* Text Password Input Mode */
          <form onSubmit={handleSubmitText} className="space-y-4 mb-6">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Enter master passcode"
                autoFocus
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-gold-500/30 text-white placeholder:text-neutral-500 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 text-center tracking-widest font-mono text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-gold-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-neutral-950 font-bold shadow-gold-glow flex items-center justify-center gap-2 btn-press"
            >
              <span>Unlock Atelier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 mb-4 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Switch Mode & Hints */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <button
            onClick={() => {
              setIsTextMode(!isTextMode);
              setPin('');
              setError(false);
            }}
            className="hover:text-gold-400 transition-colors flex items-center gap-1"
          >
            <KeyRound className="w-3 h-3" />
            <span>{isTextMode ? 'Use PIN Keypad' : 'Text Entry'}</span>
          </button>

          {/* <span className="text-[11px] text-neutral-500">
            Default: <span className="font-mono text-gold-400/80">1926</span>
          </span> */}
        </div>
      </div>
    </div>
  );
};
