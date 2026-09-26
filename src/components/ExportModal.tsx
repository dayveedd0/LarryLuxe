import React, { useRef, useState } from 'react';
import { Customer, CustomerMeasurementRecord } from '../types';
import { LuxuryMeasurementCard } from './LuxuryMeasurementCard';
import { downloadMeasurementCardAsImage, shareViaWhatsApp } from '../utils/cardExporter';
import { 
  X, 
  Download, 
  Share2, 
  Printer, 
  Check, 
  Sparkles, 
  Sun, 
  Moon, 
  MessageSquare,
  Copy
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  record: CustomerMeasurementRecord | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  customer,
  record,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [cardTheme, setCardTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !customer || !record) return null;

  const handleDownloadImage = async (format: 'png' | 'jpeg' = 'png') => {
    try {
      setIsExporting(true);
      const safeName = customer.name.replace(/[^a-zA-Z0-9]/g, '_');
      const safeStyle = (record.stylePreference || 'Measurements').replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `Larre_Luxe_${safeName}_${safeStyle}.${format}`;
      await downloadMeasurementCardAsImage(customer, record, cardTheme, fileName, format);
    } catch (err) {
      alert('Failed to download image. Please try again.');
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    shareViaWhatsApp(customer, record);
  };

  const handleCopySummary = () => {
    let summary = `👑 LARRÉ LUXE — BESPOKE MEASUREMENTS\n`;
    summary += `Client: ${customer.name} | Phone: ${customer.phone}\n`;
    summary += `Style: ${record.stylePreference} | Fit: ${record.fitPreference}\n\n`;

    record.garmentSections.forEach(s => {
      summary += `${s.name}:\n`;
      s.fields.forEach(f => {
        if (f.value) summary += `  - ${f.label}: ${f.value}"\n`;
      });
      summary += `\n`;
    });

    if (record.specialNotes) summary += `Notes: ${record.specialNotes}\n`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-4xl my-4 rounded-3xl bg-[#FCFBF7] dark:bg-obsidian-900 border border-gold-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gold-500/20 flex items-center justify-between bg-gold-500/5 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 p-0.5 shadow-gold-glow flex items-center justify-center">
              <div className="w-full h-full bg-[#FCFBF7] dark:bg-obsidian-900 rounded-[14px] flex items-center justify-center">
                <Share2 className="w-5 h-5 text-gold-500" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                <span>Download & Share Measurement Card</span>
              </h3>
              <p className="font-script text-base text-gold-600 dark:text-gold-400 -mt-1">
                Larré Luxe Digital Slip
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

        {/* Action Toolbar */}
        <div className="px-6 py-3 bg-white/70 dark:bg-obsidian-850 border-b border-gold-500/15 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Card Style Selector (Gold Light / Onyx Dark) */}
          <div className="flex items-center space-x-1.5 bg-neutral-100 dark:bg-obsidian-800 p-1 rounded-xl border border-gold-500/20">
            <button
              onClick={() => setCardTheme('light')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                cardTheme === 'light'
                  ? 'bg-white text-gold-700 shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-gold-500" />
              <span>Gold & White Card</span>
            </button>
            <button
              onClick={() => setCardTheme('dark')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                cardTheme === 'dark'
                  ? 'bg-obsidian-900 text-gold-400 shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-gold-400" />
              <span>Onyx Velvet Card</span>
            </button>
          </div>

          {/* Quick Share / Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm btn-press"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Copy text summary */}
            <button
              onClick={handleCopySummary}
              className="px-3 py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-700 dark:text-gold-300 text-xs font-medium border border-gold-500/20 flex items-center gap-1.5 transition-colors btn-press"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-700 dark:text-gold-300 text-xs font-medium border border-gold-500/20 flex items-center gap-1.5 transition-colors btn-press"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Primary Download PNG */}
            <button
              disabled={isExporting}
              onClick={() => handleDownloadImage('png')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-white text-xs font-medium shadow-gold-glow flex items-center gap-1.5 transition-all btn-press disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating Image...' : 'Download Image (PNG)'}</span>
            </button>
          </div>

        </div>

        {/* Card View Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-100/60 dark:bg-obsidian-950 flex justify-center items-start">
          <div className="w-full flex justify-center">
            <LuxuryMeasurementCard
              customer={customer}
              record={record}
              cardRef={cardRef}
              variant={cardTheme}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gold-500/20 bg-gold-500/5 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 shrink-0">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-gold-500" />
            <span>Card exports at 2.5x Ultra-HD resolution for crisp WhatsApp messaging & high-end print.</span>
          </span>
          <button
            onClick={onClose}
            className="text-neutral-600 dark:text-neutral-300 hover:underline font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
