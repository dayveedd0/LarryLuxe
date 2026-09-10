import React from 'react';
import { GarmentTemplate } from '../types';
import { DEFAULT_GARMENT_TEMPLATES } from '../data/initialData';
import { X, SlidersHorizontal, Scissors, Sparkles } from 'lucide-react';

interface GarmentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: GarmentTemplate[];
}

export const GarmentManagerModal: React.FC<GarmentManagerModalProps> = ({
  isOpen,
  onClose,
  templates = DEFAULT_GARMENT_TEMPLATES,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl rounded-3xl bg-[#FCFBF7] dark:bg-obsidian-900 border border-gold-500/30 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gold-500/20 flex items-center justify-between bg-gold-500/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 p-0.5 flex items-center justify-center shadow-gold-glow">
              <div className="w-full h-full bg-[#FCFBF7] dark:bg-obsidian-900 rounded-[14px] flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5 text-gold-500" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50">
                Garment Presets & Measurement Templates
              </h3>
              <p className="font-script text-base text-gold-600 dark:text-gold-400 -mt-1">
                Larré Luxe Standard Specifications
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

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            The studio comes pre-configured with industry-standard tailoring presets. Each preset groups body measurements into dedicated garment components (Top, Trouser, Agbada Wing, etc.) with customizable parameters.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white dark:bg-obsidian-850 p-4 rounded-2xl border border-gold-500/20 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif font-bold text-sm text-gold-700 dark:text-gold-300 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-gold-500" />
                    {tmpl.name}
                  </h4>
                  <span className="text-[10px] uppercase font-semibold text-neutral-400">
                    {tmpl.defaultSections.length} Sections
                  </span>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                  {tmpl.description}
                </p>

                <div className="space-y-2">
                  {tmpl.defaultSections.map((sec, i) => (
                    <div key={i} className="bg-gold-500/5 dark:bg-obsidian-900 p-2.5 rounded-xl border border-gold-500/15">
                      <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block mb-1">
                        {sec.name} ({sec.fields.length} points)
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sec.fields.map((f) => (
                          <span
                            key={f.id}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-obsidian-800 text-neutral-600 dark:text-neutral-400 border border-gold-500/10 font-mono"
                          >
                            {f.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gold-500/20 bg-gold-500/5 flex items-center justify-between">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-gold-500" />
            <span>You can also add custom measurement points on-the-fly during any fitting session.</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-medium shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
