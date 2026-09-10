import React, { useRef, useState } from 'react';
import { Customer } from '../types';
import { X, Database, Download, Upload, Check, AlertCircle, Sparkles } from 'lucide-react';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onRestore: (customers: Customer[]) => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  customers,
  onRestore,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(customers, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Larre_Luxe_Clients_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage({ text: 'Customer backup file downloaded successfully!', type: 'success' });
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json) && json.length > 0 && json[0].name) {
          onRestore(json);
          setStatusMessage({ text: `Successfully restored ${json.length} customer records!`, type: 'success' });
        } else {
          setStatusMessage({ text: 'Invalid backup file format. Please upload a valid Larré Luxe backup JSON file.', type: 'error' });
        }
      } catch (err) {
        setStatusMessage({ text: 'Failed to read JSON file. Please check file validity.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-3xl bg-[#FCFBF7] dark:bg-obsidian-900 border border-gold-500/30 shadow-2xl overflow-hidden animate-scale-in text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gold-500/20 flex items-center justify-between bg-gold-500/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 p-0.5 flex items-center justify-center shadow-gold-glow">
              <div className="w-full h-full bg-[#FCFBF7] dark:bg-obsidian-900 rounded-[14px] flex items-center justify-center">
                <Database className="w-5 h-5 text-gold-500" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50">
                Backup & Restore Studio Data
              </h3>
              <p className="font-script text-base text-gold-600 dark:text-gold-400 -mt-1">
                Larré Luxe Safe Storage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-gold-500/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            All customer measurements are securely stored locally on this device. You can download a complete backup file to keep your records safe or restore them on another tablet/computer.
          </p>

          {statusMessage && (
            <div className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-medium border ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' 
                : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
            }`}>
              {statusMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Export */}
            <div className="p-4 rounded-2xl bg-white dark:bg-obsidian-850 border border-gold-500/20 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1">
                  Export Data
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                  Save all ({customers.length}) customer profiles and measurement history to a JSON file.
                </p>
              </div>

              <button
                onClick={handleExportJSON}
                className="w-full py-2.5 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 text-gold-700 dark:text-gold-300 border border-gold-500/30 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors btn-press"
              >
                <Download className="w-4 h-4" />
                <span>Download Backup</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-4 rounded-2xl bg-white dark:bg-obsidian-850 border border-gold-500/20 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1">
                  Restore Backup
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                  Upload a previously saved Larré Luxe backup JSON file.
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportJSON}
                accept=".json"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-obsidian-800 hover:bg-gold-500/10 text-neutral-700 dark:text-neutral-200 border border-gold-500/20 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors btn-press"
              >
                <Upload className="w-4 h-4" />
                <span>Upload JSON</span>
              </button>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gold-500/20 bg-gold-500/5 flex items-center justify-between">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-gold-500" />
            <span>Local data persists automatically across sessions.</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-medium shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
