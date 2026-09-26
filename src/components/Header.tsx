import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SyncStatus } from '../store/useTailorStore';
import { 
  Sun, 
  Moon, 
  Plus, 
  Search, 
  Scissors, 
  SlidersHorizontal, 
  Database,
  Cloud,
  RefreshCw,
  WifiOff,
  Lock,
  Shield,
  Share2
} from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewCustomer: () => void;
  onOpenTemplates: () => void;
  onOpenBackup: () => void;
  onOpenPasscodeSettings: () => void;
  onOpenPortalShare: () => void;
  onLock: () => void;
  customerCount: number;
  measurementCount: number;
  syncStatus?: SyncStatus;
}


export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onNewCustomer,
  onOpenTemplates,
  onOpenBackup,
  onOpenPasscodeSettings,
  onOpenPortalShare,
  onLock,
  customerCount,
  measurementCount,
  syncStatus = 'synced',
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gold-500/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">
            <div className="relative group cursor-pointer">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 p-0.5 shadow-gold-glow flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                <div className="w-full h-full bg-[#FCFBF7] dark:bg-obsidian-900 rounded-[10px] sm:rounded-[14px] flex items-center justify-center overflow-hidden p-0.5 sm:p-1">
                  <img 
                    src="/assets/logo-icon.png" 
                    alt="Larré Luxe Crest" 
                    className="w-full h-full object-contain filter drop-shadow"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <Scissors className="w-4 h-4 sm:w-6 sm:h-6 text-gold-500 hidden group-has-[img:hidden]:block" />
                </div>
              </div>
            </div>

            <div>
              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-1 leading-none">
                <span className="gold-gradient-text">Larré</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-light">Luxe</span>
              </h1>
            </div>
          </div>

          {/* Quick Metrics & Cloud Sync Status (Desktop) */}
          <div className="hidden lg:flex items-center space-x-6 border-x border-gold-500/20 px-6 py-1.5">
            <div className="text-center">
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 dark:text-neutral-500">
                Clients
              </span>
              <span className="font-serif text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {customerCount}
              </span>
            </div>
            
            <div className="h-6 w-px bg-gold-500/20" />
            
            <div className="text-center">
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 dark:text-neutral-500">
                Garments Fitted
              </span>
              <span className="font-serif text-lg font-bold text-gold-600 dark:text-gold-400">
                {measurementCount}
              </span>
            </div>

            <div className="h-6 w-px bg-gold-500/20" />

            {/* Live Sync Status Badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-[11px] font-semibold">
              {syncStatus === 'synced' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
                  <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300">Live Sync</span>
                </>
              )}
              {syncStatus === 'syncing' && (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span className="text-amber-700 dark:text-amber-300">Syncing...</span>
                </>
              )}
              {syncStatus === 'offline' && (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-neutral-500">Offline</span>
                </>
              )}
            </div>
          </div>

          {/* Right Controls & Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            
            {/* Search Input (Desktop) */}
            <div className="relative hidden md:block w-36 lg:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold-600/70 dark:text-gold-400/70 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search clients..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-100/80 dark:bg-obsidian-850/80 border border-gold-500/20 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400"
              />
            </div>

            {/* Share Portal Link Button */}
            <button
              onClick={onOpenPortalShare}
              title="Share Client Self-Measurement Portal"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-gold-500/10 border border-transparent hover:border-gold-500/20 transition-all btn-press flex items-center space-x-1 text-xs font-medium"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-600 dark:text-gold-400" />
              <span className="hidden xl:inline text-xs">Client Link</span>
            </button>

            {/* Garment Templates Manager */}
            <button
              onClick={onOpenTemplates}
              title="Garment Presets & Templates"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-gold-500/10 border border-transparent hover:border-gold-500/20 transition-all btn-press flex items-center space-x-1 text-xs font-medium"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-600 dark:text-gold-400" />
              <span className="hidden xl:inline text-xs">Templates</span>
            </button>

            {/* Backup / Restore */}
            <button
              onClick={onOpenBackup}
              title="Backup & Restore Data"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-gold-500/10 border border-transparent hover:border-gold-500/20 transition-all btn-press flex items-center space-x-1 text-xs font-medium"
            >
              <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-600 dark:text-gold-400" />
              <span className="hidden xl:inline text-xs">Backup</span>
            </button>

            {/* Passcode Security Settings */}
            <button
              onClick={onOpenPasscodeSettings}
              title="Atelier Security & Passcode"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-gold-500/10 border border-transparent hover:border-gold-500/20 transition-all btn-press flex items-center space-x-1 text-xs font-medium"
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-600 dark:text-gold-400" />
            </button>

            {/* Lock Atelier Button */}
            <button
              onClick={onLock}
              title="Lock Atelier Workspace"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all btn-press flex items-center space-x-1 text-xs font-medium"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Apple HIG Smooth Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative p-2 rounded-xl bg-gold-500/10 dark:bg-obsidian-850 border border-gold-500/20 hover:border-gold-500/40 text-gold-700 dark:text-gold-400 transition-all duration-300 btn-press shadow-sm shrink-0"
            >
              <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4">
                <Sun className={`w-3.5 h-3.5 sm:w-4 sm:h-4 absolute inset-0 transition-transform duration-300 ${theme === 'dark' ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`} />
                <Moon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 absolute inset-0 transition-transform duration-300 ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`} />
              </div>
            </button>

            {/* Add Client Compact Primary CTA */}
            <button
              onClick={onNewCustomer}
              className="btn-press flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-white font-medium text-xs shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 border border-gold-300/30 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="font-semibold whitespace-nowrap">Add Client</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

