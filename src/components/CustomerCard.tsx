import React from 'react';
import { Customer } from '../types';
import { 
  Phone, 
  Calendar, 
  Ruler, 
  Share2, 
  MoreVertical, 
  Plus
} from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
  onSelect: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onNewMeasurement: (customer: Customer) => void;
  onExportLatest: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  isSelected?: boolean;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onSelect,
  onEditCustomer,
  onNewMeasurement,
  onExportLatest,
  onDeleteCustomer,
  isSelected
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const latestRecord = customer.measurements[customer.measurements.length - 1];

  // Helper to extract key dimensions for quick preview chip
  const topSection = latestRecord?.garmentSections.find(s => s.name.toUpperCase().includes('TOP'));
  const trouserSection = latestRecord?.garmentSections.find(s => s.name.toUpperCase().includes('TROUSER'));

  const chest = topSection?.fields.find(f => f.id === 'chest')?.value;
  const waist = trouserSection?.fields.find(f => f.id === 'waist')?.value;
  const length = trouserSection?.fields.find(f => f.id === 'trouserLength')?.value;

  const initials = customer.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={() => onSelect(customer)}
      className={`group relative rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer text-left ${
        isSelected
          ? 'bg-gradient-to-br from-gold-500/15 via-white to-gold-500/10 dark:from-gold-500/20 dark:via-obsidian-900 dark:to-obsidian-850 border-2 border-gold-500 shadow-gold-glow'
          : 'bg-white/80 dark:bg-obsidian-900/80 hover:bg-white dark:hover:bg-obsidian-900 border border-gold-500/20 hover:border-gold-500/50 shadow-apple-subtle hover:shadow-apple-elevated'
      }`}
    >
      {/* Top Row: Avatar, Name & Options */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center space-x-3.5">
          {/* Avatar Monogram */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 text-white font-serif font-bold text-lg flex items-center justify-center shadow-sm p-0.5 shrink-0">
            <div className="w-full h-full bg-[#1C1B18] rounded-[14px] flex items-center justify-center text-gold-400">
              {initials || 'LL'}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                {customer.name}
              </h3>
              {customer.tags && customer.tags.length > 0 && (
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-gold-500/15 text-gold-700 dark:text-gold-300 border border-gold-500/20">
                  {customer.tags[0]}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              <a
                href={`tel:${customer.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:text-gold-600 dark:hover:text-gold-400 flex items-center gap-1 transition-colors"
              >
                <Phone className="w-3 h-3 text-gold-500" />
                <span>{customer.phone || 'No phone'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-gold-500/10 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-44 rounded-2xl bg-white dark:bg-obsidian-850 border border-gold-500/20 shadow-apple-elevated z-30 p-1.5 text-xs animate-scale-in">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEditCustomer(customer);
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-gold-500/10 dark:hover:bg-obsidian-800 text-neutral-700 dark:text-neutral-200 font-medium"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onNewMeasurement(customer);
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-gold-500/10 dark:hover:bg-obsidian-800 text-gold-600 dark:text-gold-400 font-medium flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Measurements
              </button>
              {latestRecord && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onExportLatest(customer);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-gold-500/10 dark:hover:bg-obsidian-800 text-neutral-700 dark:text-neutral-200 font-medium flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> Download / Share Card
                </button>
              )}
              <div className="h-px bg-gold-500/15 my-1" />
              <button
                onClick={() => {
                  setShowMenu(false);
                  if (confirm(`Remove ${customer.name} from records?`)) {
                    onDeleteCustomer(customer.id);
                  }
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-500 font-medium"
              >
                Delete Client
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Latest Measurement Snapshot */}
      {latestRecord ? (
        <div className="bg-gold-500/5 dark:bg-white/[0.02] rounded-2xl p-3.5 border border-gold-500/15 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300 truncate max-w-[180px]">
              {latestRecord.stylePreference || 'Custom Style'}
            </span>
            <span className="text-[11px] text-gold-600 dark:text-gold-400 flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3" />
              {latestRecord.dateRef || 'Recent'}
            </span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/80 dark:bg-obsidian-800/80 p-1.5 rounded-xl border border-gold-500/15">
              <span className="text-[10px] text-neutral-400 uppercase block">Chest</span>
              <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100">{chest ? `${chest}″` : '—'}</span>
            </div>
            <div className="bg-white/80 dark:bg-obsidian-800/80 p-1.5 rounded-xl border border-gold-500/15">
              <span className="text-[10px] text-neutral-400 uppercase block">Waist</span>
              <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100">{waist ? `${waist}″` : '—'}</span>
            </div>
            <div className="bg-white/80 dark:bg-obsidian-800/80 p-1.5 rounded-xl border border-gold-500/15">
              <span className="text-[10px] text-neutral-400 uppercase block">Length</span>
              <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100">{length ? `${length}″` : '—'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-50 dark:bg-obsidian-850 rounded-2xl p-4 text-center text-xs text-neutral-400 border border-dashed border-gold-500/20 mb-4">
          No measurements logged yet
        </div>
      )}

      {/* Footer Quick Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-gold-500/15 text-xs">
        <span className="text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
          <Ruler className="w-3.5 h-3.5 text-gold-500" />
          {customer.measurements.length} {customer.measurements.length === 1 ? 'Fitting' : 'Fittings'}
        </span>

        <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
          {latestRecord && (
            <button
              onClick={() => onExportLatest(customer)}
              title="View & Download Measurement Card"
              className="p-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-700 dark:text-gold-300 transition-colors btn-press flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Export</span>
            </button>
          )}

          <button
            onClick={() => onNewMeasurement(customer)}
            className="p-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-white transition-all btn-press flex items-center gap-1 font-medium shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Measure</span>
          </button>
        </div>
      </div>
    </div>
  );
};
