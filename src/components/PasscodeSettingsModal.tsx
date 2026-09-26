import React, { useState } from 'react';
import { KeyRound, Check, X, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useTailorStore } from '../store/useTailorStore';


interface PasscodeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasscodeSettingsModal: React.FC<PasscodeSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { masterPasscode, setMasterPasscode } = useTailorStore();
  const [currentInput, setCurrentInput] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showPasscodes, setShowPasscodes] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check current passcode
    if (currentInput !== masterPasscode) {
      setError('Current passcode is incorrect.');
      return;
    }

    if (newPasscode.length < 4) {
      setError('New passcode must be at least 4 characters/digits.');
      return;
    }

    if (newPasscode !== confirmPasscode) {
      setError('New passcodes do not match.');
      return;
    }

    setMasterPasscode(newPasscode);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setCurrentInput('');
      setNewPasscode('');
      setConfirmPasscode('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel border border-gold-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-800/50 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 p-0.5 shadow-gold-glow flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-neutral-900 rounded-[14px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-50">
              Atelier Security Settings
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Manage master passcode to protect client data
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-4 ring-emerald-500/10">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-emerald-400">
              Passcode Updated Successfully
            </h3>
            <p className="text-xs text-neutral-400">
              Your new master passcode is now active.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Current Passcode */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                Current Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscodes ? 'text' : 'password'}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Enter current passcode"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 text-neutral-900 dark:text-neutral-100 text-sm font-mono"
                />
              </div>
            </div>

            {/* New Passcode */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                New Passcode (4+ digits / characters)
              </label>
              <div className="relative">
                <input
                  type={showPasscodes ? 'text' : 'password'}
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  placeholder="Enter new master passcode"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 text-neutral-900 dark:text-neutral-100 text-sm font-mono"
                />
              </div>
            </div>

            {/* Confirm New Passcode */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                Confirm New Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscodes ? 'text' : 'password'}
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  placeholder="Re-enter new passcode"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 text-neutral-900 dark:text-neutral-100 text-sm font-mono"
                />
              </div>
            </div>

            {/* Show Password Toggle */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPasscodes(!showPasscodes)}
                className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-gold-500 flex items-center gap-1.5"
              >
                {showPasscodes ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPasscodes ? 'Hide Passcodes' : 'Show Passcodes'}</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gold-500/15">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-obsidian-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:from-gold-300 hover:to-amber-500 text-neutral-950 text-xs font-bold shadow-gold-glow flex items-center gap-1.5 btn-press"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Save New Passcode</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
