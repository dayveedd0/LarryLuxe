import React from 'react';
import { Customer, CustomerMeasurementRecord } from '../types';
import { Scissors, Sparkles, Phone, Calendar, Shirt, CheckCircle2 } from 'lucide-react';

interface LuxuryMeasurementCardProps {
  customer: Customer;
  record: CustomerMeasurementRecord;
  cardRef?: React.RefObject<HTMLDivElement>;
  variant?: 'light' | 'dark' | 'auto';
  showActions?: boolean;
}

export const LuxuryMeasurementCard: React.FC<LuxuryMeasurementCardProps> = ({
  customer,
  record,
  cardRef,
  variant = 'auto',
}) => {
  // Determine dark state accurately for both auto theme and explicit preview variants
  const isDark = variant === 'dark' || (variant === 'auto' && typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  // Find TOP and TROUSER sections if they exist, plus other custom sections
  const topSection = record.garmentSections.find(s => s.name.toUpperCase().includes('TOP') || s.name.toUpperCase().includes('SHIRT') || s.name.toUpperCase().includes('JACKET'));
  const trouserSection = record.garmentSections.find(s => s.name.toUpperCase().includes('TROUSER') || s.name.toUpperCase().includes('PANT') || s.name.toUpperCase().includes('SOKOTO'));
  const otherSections = record.garmentSections.filter(s => s !== topSection && s !== trouserSection);

  return (
    <div
      ref={cardRef}
      id="printable-card"
      className={`relative w-full max-w-2xl mx-auto rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 shadow-2xl transition-all duration-300 overflow-hidden box-border ${
        isDark
          ? 'bg-[#0E1015] text-white border border-gold-500/30'
          : 'bg-[#FCFBF7] text-neutral-950 border-2 border-gold-500/35'
      }`}
      style={{
        boxSizing: 'border-box',
        boxShadow: isDark
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(197, 160, 89, 0.08)'
          : '0 20px 40px -10px rgba(197, 160, 89, 0.2), inset 0 0 40px rgba(245, 236, 219, 0.5)',
      }}
    >
      {/* Ornate Gold Filigree Border Accents */}
      <div className="absolute top-2.5 left-2.5 w-5 h-5 sm:w-7 sm:h-7 border-t-2 border-l-2 border-gold-500/70 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 w-5 h-5 sm:w-7 sm:h-7 border-t-2 border-r-2 border-gold-500/70 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-2.5 left-2.5 w-5 h-5 sm:w-7 sm:h-7 border-b-2 border-l-2 border-gold-500/70 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 w-5 h-5 sm:w-7 sm:h-7 border-b-2 border-r-2 border-gold-500/70 rounded-br-xl pointer-events-none" />

      {/* Watermark Crest Background */}
      <div className="absolute right-4 bottom-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none w-56 sm:w-72 h-56 sm:h-72">
        <img src="/assets/logo.png" alt="" className="w-full h-full object-contain" />
      </div>

      {/* Card Header: Brand Logo & Title */}
      <div className="text-center pb-4 sm:pb-5 mb-4 sm:mb-5 border-b border-gold-500/20 relative">
        <div className="flex justify-center items-center gap-2 mb-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-gold-400 via-gold-500 to-amber-700 p-0.5 shadow flex items-center justify-center">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center p-0.5 ${isDark ? 'bg-obsidian-900' : 'bg-[#FCFBF7]'}`}>
              <img src="/assets/logo-icon.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-wider uppercase">
          <span className="gold-gradient-text">Larré</span> <span className={isDark ? 'text-white' : 'text-neutral-950'}>Luxe</span>
        </h2>
        <p className="font-script text-lg sm:text-xl md:text-2xl text-gold-600 dark:text-gold-400 mt-0.5">
          Customer Measurements & Atelier Record
        </p>

        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2">
          <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-gold-500/40" />
          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold-500" />
          <span className={`text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.25em] uppercase font-bold ${isDark ? 'text-gold-300' : 'text-gold-800'}`}>
            Haute Couture • Bespoke Tailoring
          </span>
          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold-500" />
          <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-gold-500/40" />
        </div>
      </div>

      {/* Customer Information Header Fields (High Contrast & Responsive) */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border ${
        isDark 
          ? 'bg-obsidian-900/80 border-gold-500/25' 
          : 'bg-white border-gold-500/25 shadow-sm'
      }`}>
        {/* Customer Name */}
        <div className="flex items-center gap-2 overflow-hidden">
          <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider shrink-0 w-28 sm:w-32 text-left ${isDark ? 'text-gold-300' : 'text-gold-900'}`}>
            Customer Name :
          </span>
          <span className={`font-serif font-bold text-xs sm:text-sm md:text-base flex-1 border-b border-dashed border-gold-500/35 pb-0.5 truncate text-left ${isDark ? 'text-white' : 'text-neutral-950'}`}>
            {customer.name || '____________________'}
          </span>
        </div>

        {/* Date Ref */}
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1 shrink-0 w-20 sm:w-24 text-left">
            <Calendar className="w-3 h-3 text-gold-500 shrink-0" />
            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gold-300' : 'text-gold-900'}`}>
              Date Ref :
            </span>
          </div>
          <span className={`font-bold font-mono text-xs sm:text-sm flex-1 border-b border-dashed border-gold-500/35 pb-0.5 truncate text-left ${isDark ? 'text-neutral-100' : 'text-neutral-950'}`}>
            {record.dateRef || '____________________'}
          </span>
        </div>

        {/* Style */}
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1 shrink-0 w-28 sm:w-32 text-left">
            <Shirt className="w-3 h-3 text-gold-500 shrink-0" />
            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gold-300' : 'text-gold-900'}`}>
              Style :
            </span>
          </div>
          <span className={`font-semibold text-xs sm:text-sm flex-1 border-b border-dashed border-gold-500/35 pb-0.5 truncate text-left ${isDark ? 'text-white' : 'text-neutral-950'}`}>
            {record.stylePreference || '____________________'}
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1 shrink-0 w-20 sm:w-24 text-left">
            <Phone className="w-3 h-3 text-gold-500 shrink-0" />
            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gold-300' : 'text-gold-900'}`}>
              Phone nō :
            </span>
          </div>
          <span className={`font-mono text-xs sm:text-sm font-bold flex-1 border-b border-dashed border-gold-500/35 pb-0.5 truncate text-left ${isDark ? 'text-neutral-100' : 'text-neutral-950'}`}>
            {customer.phone || '____________________'}
          </span>
        </div>
      </div>


      {/* Main Measurements Grid: TOP & TROUSER Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
        
        {/* TOP Section */}
        {topSection && (
          <div className={`rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border shadow-sm backdrop-blur-sm ${
            isDark 
              ? 'bg-obsidian-900/90 border-gold-500/30' 
              : 'bg-white border-gold-500/30 shadow-sm'
          }`}>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gold-500/20">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Scissors className="w-3.5 h-3.5 text-gold-500" />
                <h3 className={`font-serif font-bold text-xs sm:text-sm tracking-widest uppercase ${isDark ? 'text-gold-300' : 'text-gold-900'}`}>
                  {topSection.name}
                </h3>
              </div>
              <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Inches (″)</span>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              {topSection.fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between py-1 border-b border-gold-500/10 last:border-0">
                  <span className={`font-semibold flex items-center text-xs sm:text-sm ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                    <span className="text-gold-500 mr-1.5 font-bold">•</span>
                    {field.label}:
                  </span>
                  <span className={`font-mono font-bold text-xs sm:text-sm md:text-base px-2 sm:px-2.5 py-0.5 rounded-lg border min-w-[48px] sm:min-w-[52px] text-right shrink-0 ${
                    isDark 
                      ? 'bg-gold-500/20 text-gold-200 border-gold-400/40' 
                      : 'bg-gold-500/15 text-neutral-950 border-gold-600/30 font-extrabold'
                  }`}>
                    {field.value ? `${field.value}″` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TROUSER Section */}
        {trouserSection && (
          <div className={`rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border shadow-sm backdrop-blur-sm ${
            isDark 
              ? 'bg-obsidian-900/90 border-gold-500/30' 
              : 'bg-white border-gold-500/30 shadow-sm'
          }`}>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gold-500/20">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Scissors className="w-3.5 h-3.5 text-gold-500" />
                <h3 className={`font-serif font-bold text-xs sm:text-sm tracking-widest uppercase ${isDark ? 'text-gold-300' : 'text-gold-900'}`}>
                  {trouserSection.name}
                </h3>
              </div>
              <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Inches (″)</span>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              {trouserSection.fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between py-1 border-b border-gold-500/10 last:border-0">
                  <span className={`font-semibold flex items-center text-xs sm:text-sm ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                    <span className="text-gold-500 mr-1.5 font-bold">•</span>
                    {field.label}:
                  </span>
                  <span className={`font-mono font-bold text-xs sm:text-sm md:text-base px-2 sm:px-2.5 py-0.5 rounded-lg border min-w-[48px] sm:min-w-[52px] text-right shrink-0 ${
                    isDark 
                      ? 'bg-gold-500/20 text-gold-200 border-gold-400/40' 
                      : 'bg-gold-500/15 text-neutral-950 border-gold-600/30 font-extrabold'
                  }`}>
                    {field.value ? `${field.value}″` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional Custom Garment Sections (if present) */}
      {otherSections.length > 0 && (
        <div className="space-y-4 mb-4 sm:mb-5">
          {otherSections.map((section) => (
            <div key={section.id} className={`rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border shadow-sm ${
              isDark 
                ? 'bg-obsidian-900/90 border-gold-500/30' 
                : 'bg-white border-gold-500/30 shadow-sm'
            }`}>
              <h3 className={`font-serif font-bold text-xs sm:text-sm tracking-widest uppercase pb-2 mb-2.5 border-b border-gold-500/20 flex items-center gap-2 ${
                isDark ? 'text-gold-300' : 'text-gold-900'
              }`}>
                <Scissors className="w-3.5 h-3.5 text-gold-500" />
                {section.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
                {section.fields.map((f) => (
                  <div key={f.id} className={`flex items-center justify-between text-xs p-2 rounded-xl border ${
                    isDark 
                      ? 'bg-obsidian-850 text-neutral-100 border-gold-500/20' 
                      : 'bg-gold-500/10 text-neutral-950 border-gold-500/25'
                  }`}>
                    <span className="truncate mr-1.5 font-semibold">{f.label}:</span>
                    <span className="font-mono font-bold text-xs sm:text-sm">{f.value ? `${f.value}″` : '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bespoke Attributes: Preferred Fit, Fabric Type, Color (Responsive on mobile) */}
      <div className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border mb-4 sm:mb-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5 ${
        isDark 
          ? 'bg-obsidian-900/90 border-gold-500/30' 
          : 'bg-white border-gold-500/30 shadow-sm'
      }`}>
        {/* Preferred Fit */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          isDark 
            ? 'bg-obsidian-850/90 border-gold-500/20' 
            : 'bg-gold-500/5 border-gold-500/25'
        }`}>
          <span className={`block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-left ${
            isDark ? 'text-gold-300' : 'text-gold-900'
          }`}>
            Preferred Fit
          </span>
          <div className={`mt-1.5 flex items-center space-x-1.5 font-bold text-xs sm:text-sm min-h-[24px] text-left ${
            isDark ? 'text-white' : 'text-neutral-950'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            <span className="truncate">{record.fitPreference || 'Tailored Bespoke'}</span>
          </div>
        </div>

        {/* Fabric Type */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          isDark 
            ? 'bg-obsidian-850/90 border-gold-500/20' 
            : 'bg-gold-500/5 border-gold-500/25'
        }`}>
          <span className={`block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-left ${
            isDark ? 'text-gold-300' : 'text-gold-900'
          }`}>
            Fabric Type
          </span>
          <div className={`mt-1.5 flex items-center font-bold text-xs sm:text-sm min-h-[24px] text-left ${
            isDark ? 'text-white' : 'text-neutral-950'
          }`}>
            <span className="truncate">{record.fabricType || 'Client Choice Fabric'}</span>
          </div>
        </div>

        {/* Color Tone */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          isDark 
            ? 'bg-obsidian-850/90 border-gold-500/20' 
            : 'bg-gold-500/5 border-gold-500/25'
        }`}>
          <span className={`block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-left ${
            isDark ? 'text-gold-300' : 'text-gold-900'
          }`}>
            Color Tone
          </span>
          <div className={`mt-1.5 flex items-center space-x-2 font-bold text-xs sm:text-sm min-h-[24px] text-left ${
            isDark ? 'text-white' : 'text-neutral-950'
          }`}>
            {record.colorHex && (
              <span
                className="w-3.5 h-3.5 rounded-full border border-gold-500/50 shadow-sm shrink-0"
                style={{ backgroundColor: record.colorHex }}
              />
            )}
            <span className="truncate">{record.color || 'Bespoke Palette'}</span>
          </div>
        </div>
      </div>


      {/* Special Notes Section */}
      <div className={`mb-4 sm:mb-5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border ${
        isDark 
          ? 'bg-obsidian-900/90 border-gold-500/30' 
          : 'bg-white border-gold-500/30 shadow-sm'
      }`}>
        <span className={`block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1 ${
          isDark ? 'text-gold-300' : 'text-gold-900'
        }`}>
          Special Notes & Atelier Instructions:
        </span>
        <p className={`text-xs sm:text-sm leading-relaxed italic break-words min-h-[28px] sm:min-h-[36px] ${
          isDark ? 'text-neutral-100' : 'text-neutral-950 font-medium'
        }`}>
          {record.specialNotes || 'No specific alterations requested. Standard artisan precision apply.'}
        </p>
      </div>

      {/* Card Footer / Artisan Seal */}
      <div className="pt-3 sm:pt-4 border-t border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
        <div>
          <p className="font-script text-base sm:text-lg text-gold-600 dark:text-gold-400">
            Larré Luxe Master Tailor Signature
          </p>
          <div className="w-28 sm:w-36 h-px bg-gold-500/40 mx-auto sm:mx-0 mt-0.5" />
        </div>

        <div className={`text-[9px] sm:text-[10px] tracking-wider uppercase font-mono font-semibold ${
          isDark ? 'text-neutral-400' : 'text-neutral-600'
        }`}>
          REF #{record.id.slice(-6).toUpperCase()} • CONFIDENTIAL CLIENT RECORD
        </div>
      </div>

    </div>
  );
};
