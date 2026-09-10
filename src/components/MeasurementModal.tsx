import React, { useState, useEffect } from 'react';
import { Customer, CustomerMeasurementRecord, GarmentSection, FitPreference } from '../types';
import { DEFAULT_GARMENT_TEMPLATES, createDefaultGarmentSections, POPULAR_FABRICS, POPULAR_COLORS } from '../data/initialData';
import { 
  X, 
  Ruler, 
  Scissors, 
  Sparkles, 
  Plus, 
  Trash2, 
  Calendar, 
  Palette, 
  Layers, 
  Eye,
  Edit3
} from 'lucide-react';
import { LuxuryMeasurementCard } from './LuxuryMeasurementCard';

interface MeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerId: string, record: CustomerMeasurementRecord) => void;
  customer: Customer | null;
  existingRecord?: CustomerMeasurementRecord | null;
}

export const MeasurementModal: React.FC<MeasurementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customer,
  existingRecord,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('top-and-trouser');
  const [dateRef, setDateRef] = useState<string>('');
  const [stylePreference, setStylePreference] = useState<string>('');
  const [fitPreference, setFitPreference] = useState<FitPreference>('Bespoke Tailored');
  const [fabricType, setFabricType] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [colorHex, setColorHex] = useState<string>('#D4AF37');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [garmentSections, setGarmentSections] = useState<GarmentSection[]>([]);
  const [activeSectionTab, setActiveSectionTab] = useState<string>('sec-top');
  const [activeFieldFocus, setActiveFieldFocus] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState<boolean>(false);

  // Initialize or reset form
  useEffect(() => {
    if (existingRecord) {
      setDateRef(existingRecord.dateRef || '');
      setStylePreference(existingRecord.stylePreference || '');
      setFitPreference(existingRecord.fitPreference || 'Bespoke Tailored');
      setFabricType(existingRecord.fabricType || '');
      setColor(existingRecord.color || '');
      setColorHex(existingRecord.colorHex || '#D4AF37');
      setSpecialNotes(existingRecord.specialNotes || '');
      setGarmentSections(JSON.parse(JSON.stringify(existingRecord.garmentSections)));
      if (existingRecord.garmentSections.length > 0) {
        setActiveSectionTab(existingRecord.garmentSections[0].id);
      }
    } else {
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${today.toLocaleString('default', { month: 'short' })}-${today.getFullYear()}`;
      setDateRef(formattedDate);
      setStylePreference('');
      setFitPreference('Bespoke Tailored');
      setFabricType('');
      setColor('');
      setColorHex('#D4AF37');
      setSpecialNotes('');
      const defaults = createDefaultGarmentSections();
      setGarmentSections(defaults);
      setActiveSectionTab(defaults[0]?.id || '');
    }
  }, [existingRecord, isOpen]);

  if (!isOpen || !customer) return null;

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = DEFAULT_GARMENT_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const newSections: GarmentSection[] = template.defaultSections.map((sec, idx) => ({
      id: `sec-${idx}-${Date.now()}`,
      name: sec.name,
      fields: sec.fields.map(f => ({
        id: f.id,
        label: f.label,
        value: '',
      }))
    }));

    setGarmentSections(newSections);
    if (newSections.length > 0) {
      setActiveSectionTab(newSections[0].id);
    }
  };

  // Update a specific field value
  const handleFieldValueChange = (sectionId: string, fieldId: string, value: string) => {
    setGarmentSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          fields: sec.fields.map(f => (f.id === fieldId ? { ...f, value } : f))
        };
      })
    );
  };

  // Quick fraction / stepper helper
  const applyQuickFraction = (sectionId: string, fieldId: string, fraction: string) => {
    setGarmentSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          fields: sec.fields.map(f => {
            if (f.id !== fieldId) return f;
            const current = f.value || '0';
            const baseInt = Math.floor(parseFloat(current) || 0);
            let newValue = '';
            if (fraction === '.00') newValue = `${baseInt > 0 ? baseInt : ''}`;
            else if (fraction === '.25') newValue = `${baseInt > 0 ? baseInt : '0'}.25`;
            else if (fraction === '.50') newValue = `${baseInt > 0 ? baseInt : '0'}.5`;
            else if (fraction === '.75') newValue = `${baseInt > 0 ? baseInt : '0'}.75`;
            else if (fraction === '+1') newValue = `${(parseFloat(current) || 0) + 1}`;
            else if (fraction === '-1') newValue = `${Math.max(0, (parseFloat(current) || 0) - 1)}`;
            return { ...f, value: newValue };
          })
        };
      })
    );
  };

  // Add custom section
  const handleAddCustomSection = () => {
    const name = prompt('Enter title for new garment section (e.g., WAISTCOAT, CAP, EMBROIDERY SPAN):');
    if (!name || !name.trim()) return;
    const newSection: GarmentSection = {
      id: `sec-${Date.now()}`,
      name: name.trim().toUpperCase(),
      fields: [
        { id: 'custom-1', label: 'Primary Dimension', value: '' },
        { id: 'custom-2', label: 'Secondary Dimension', value: '' },
      ]
    };
    setGarmentSections([...garmentSections, newSection]);
    setActiveSectionTab(newSection.id);
  };

  // Add custom field to current section
  const handleAddCustomField = (sectionId: string) => {
    const label = prompt('Enter label for new measurement (e.g., Wrist To Elbow, Neck Drop):');
    if (!label || !label.trim()) return;
    setGarmentSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          fields: [
            ...sec.fields,
            { id: `field-${Date.now()}`, label: label.trim(), value: '' }
          ]
        };
      })
    );
  };

  // Remove field
  const handleRemoveField = (sectionId: string, fieldId: string) => {
    setGarmentSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          fields: sec.fields.filter(f => f.id !== fieldId)
        };
      })
    );
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recordToSave: CustomerMeasurementRecord = {
      id: existingRecord?.id || `rec-${Date.now()}`,
      dateRef: dateRef.trim() || new Date().toLocaleDateString(),
      stylePreference: stylePreference.trim() || 'Bespoke Tailoring',
      fitPreference,
      fabricType: fabricType.trim(),
      color: color.trim(),
      colorHex,
      garmentSections,
      specialNotes: specialNotes.trim(),
      createdAt: existingRecord?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(customer.id, recordToSave);
    onClose();
  };

  const activeSection = garmentSections.find(s => s.id === activeSectionTab) || garmentSections[0];

  // Temporary record for live preview
  const livePreviewRecord: CustomerMeasurementRecord = {
    id: existingRecord?.id || 'rec-preview',
    dateRef: dateRef || 'Today',
    stylePreference: stylePreference || 'Haute Couture Style',
    fitPreference,
    fabricType,
    color,
    colorHex,
    garmentSections,
    specialNotes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-5xl my-4 rounded-3xl bg-[#FCFBF7] dark:bg-obsidian-900 border border-gold-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-in text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gold-500/20 flex items-center justify-between bg-gold-500/5 shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 p-0.5 shadow-gold-glow flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#FCFBF7] dark:bg-obsidian-900 rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
                <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-base sm:text-lg lg:text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  {existingRecord ? 'Edit Measurements' : 'Measurement Studio'}
                </h3>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-700 dark:text-gold-300 border border-gold-500/20 truncate max-w-[100px] sm:max-w-none">
                  {customer.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                showLivePreview 
                  ? 'bg-gold-500 text-white border-gold-400 shadow-gold-glow' 
                  : 'bg-gold-500/10 hover:bg-gold-500/20 text-gold-700 dark:text-gold-300 border-gold-500/20'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showLivePreview ? 'Edit Mode' : 'Card Preview'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-gold-500/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {showLivePreview ? (
            <div className="py-4">
              <div className="text-center mb-4 text-xs text-neutral-500 dark:text-neutral-400">
                Live interactive preview of how the customer measurement card will appear & export.
              </div>
              <LuxuryMeasurementCard customer={customer} record={livePreviewRecord} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Preset Template Selector (Only when creating new record) */}
              {!existingRecord && (
                <div className="bg-gold-500/5 dark:bg-obsidian-850 p-3.5 rounded-2xl border border-gold-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gold-700 dark:text-gold-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-gold-500" />
                      Garment Preset Template
                    </label>
                    <span className="text-[11px] text-neutral-400">Quickly loads pre-configured body points</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DEFAULT_GARMENT_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleTemplateChange(tmpl.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all border ${
                          selectedTemplateId === tmpl.id
                            ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-white border-gold-400 shadow-sm'
                            : 'bg-white dark:bg-obsidian-800 text-neutral-700 dark:text-neutral-300 border-gold-500/20 hover:border-gold-500/40'
                        }`}
                      >
                        <div className="font-bold truncate">{tmpl.name}</div>
                        <div className="text-[10px] opacity-80 truncate">{tmpl.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Details Grid (Style Preference, Date, Fit) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1 flex items-center gap-1">
                    <Scissors className="w-3.5 h-3.5 text-gold-500" />
                    Style Preference
                  </label>
                  <input
                    type="text"
                    required
                    value={stylePreference}
                    onChange={(e) => setStylePreference(e.target.value)}
                    placeholder="e.g. Royal Emerald Senator, 3-Piece Tuxedo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    Date Ref
                  </label>
                  <input
                    type="text"
                    value={dateRef}
                    onChange={(e) => setDateRef(e.target.value)}
                    placeholder="DD-MMM-YYYY"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                    Preferred Fit
                  </label>
                  <select
                    value={fitPreference}
                    onChange={(e) => setFitPreference(e.target.value as FitPreference)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                  >
                    <option value="Bespoke Tailored">Bespoke Tailored (Standard)</option>
                    <option value="Slim Fit">Slim Fit</option>
                    <option value="Regular Fit">Regular Fit</option>
                    <option value="Relaxed Fit">Relaxed Fit</option>
                    <option value="Loose Fit">Loose Fit</option>
                  </select>
                </div>
              </div>

              {/* Garment Section Tabs (Apple HIG Segmented Control) */}
              <div className="border-t border-b border-gold-500/20 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-700 dark:text-gold-300 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-gold-500" />
                    Garment Measurements (Inches)
                  </span>
                  
                  <button
                    type="button"
                    onClick={handleAddCustomSection}
                    className="text-xs text-gold-600 dark:text-gold-400 hover:text-gold-700 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Garment Section</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {garmentSections.map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSectionTab(sec.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all uppercase flex items-center gap-1.5 ${
                        activeSectionTab === sec.id
                          ? 'bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 text-white shadow-gold-glow'
                          : 'bg-white/80 dark:bg-obsidian-800 text-neutral-600 dark:text-neutral-400 border border-gold-500/20 hover:border-gold-500/40'
                      }`}
                    >
                      <Scissors className="w-3 h-3" />
                      <span>{sec.name}</span>
                      <span className="ml-1 text-[10px] opacity-75 font-mono">
                        ({sec.fields.filter(f => f.value.trim() !== '').length}/{sec.fields.length})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Section Measurement Inputs */}
              {activeSection && (
                <div className="bg-white/80 dark:bg-obsidian-850/80 p-5 rounded-3xl border border-gold-500/20 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gold-500/15">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                        {activeSection.name} Measurements
                      </h4>
                      <span className="text-[11px] text-gold-600 dark:text-gold-400 font-medium">
                        (All values in inches ″)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddCustomField(activeSection.id)}
                      className="text-xs text-gold-600 dark:text-gold-400 hover:text-gold-700 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Custom Measurement</span>
                    </button>
                  </div>

                  {/* Measurement Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {activeSection.fields.map((field) => (
                      <div
                        key={field.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          activeFieldFocus === field.id
                            ? 'bg-gold-500/10 border-gold-500 ring-2 ring-gold-500/20'
                            : 'bg-gold-500/[0.03] dark:bg-obsidian-900 border-gold-500/20 hover:border-gold-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                            • {field.label}:
                          </label>
                          {activeSection.fields.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveField(activeSection.id, field.id)}
                              className="text-neutral-300 hover:text-red-500 p-0.5 transition-colors"
                              title="Delete this field"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <div className="relative mb-2">
                          <input
                            type="text"
                            value={field.value}
                            onFocus={() => setActiveFieldFocus(field.id)}
                            onChange={(e) => handleFieldValueChange(activeSection.id, field.id, e.target.value)}
                            placeholder="0.00"
                            className="w-full pr-8 pl-3 py-2 rounded-xl bg-white dark:bg-obsidian-800 border border-gold-500/30 text-neutral-900 dark:text-neutral-100 font-mono font-bold text-base focus:border-gold-500 focus:outline-none text-right"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 font-serif font-bold text-sm pointer-events-none">
                            ″
                          </span>
                        </div>

                        {/* Quick Fraction Chips */}
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          <button
                            type="button"
                            onClick={() => applyQuickFraction(activeSection.id, field.id, '.25')}
                            className="flex-1 py-1 rounded bg-neutral-100 dark:bg-obsidian-800 hover:bg-gold-500/20 text-neutral-600 dark:text-neutral-300 font-mono font-semibold transition-colors"
                          >
                            ¼″
                          </button>
                          <button
                            type="button"
                            onClick={() => applyQuickFraction(activeSection.id, field.id, '.50')}
                            className="flex-1 py-1 rounded bg-neutral-100 dark:bg-obsidian-800 hover:bg-gold-500/20 text-neutral-600 dark:text-neutral-300 font-mono font-semibold transition-colors"
                          >
                            ½″
                          </button>
                          <button
                            type="button"
                            onClick={() => applyQuickFraction(activeSection.id, field.id, '.75')}
                            className="flex-1 py-1 rounded bg-neutral-100 dark:bg-obsidian-800 hover:bg-gold-500/20 text-neutral-600 dark:text-neutral-300 font-mono font-semibold transition-colors"
                          >
                            ¾″
                          </button>
                          <button
                            type="button"
                            onClick={() => applyQuickFraction(activeSection.id, field.id, '+1')}
                            className="px-1.5 py-1 rounded bg-gold-500/15 hover:bg-gold-500/30 text-gold-700 dark:text-gold-300 font-bold transition-colors"
                          >
                            +1
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fabric, Color Swatch & Custom Color Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                    Fabric Type
                  </label>
                  <input
                    type="text"
                    value={fabricType}
                    onChange={(e) => setFabricType(e.target.value)}
                    placeholder="e.g. Super 160s Italian Wool / Swiss Voile"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none mb-1.5"
                  />
                  {/* Popular Fabric Quick Tags */}
                  <div className="flex flex-wrap gap-1">
                    {POPULAR_FABRICS.slice(0, 4).map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFabricType(f)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-gold-500/10 hover:bg-gold-500/20 text-gold-700 dark:text-gold-300 transition-colors"
                      >
                        {f.split(' ')[0]}...
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-gold-500" />
                    Color & Tone
                  </label>
                  <div className="flex gap-2 mb-1.5">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => {
                        setColorHex(e.target.value);
                        if (!color) setColor('Custom Color');
                      }}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-gold-500/30 p-0.5 bg-transparent"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="e.g. Deep Forest Emerald with Gold Accents"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none"
                    />
                  </div>

                  {/* Popular Color Swatches */}
                  <div className="flex items-center gap-1.5">
                    {POPULAR_COLORS.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          setColor(c.name);
                          setColorHex(c.hex);
                        }}
                        title={c.name}
                        style={{ backgroundColor: c.hex }}
                        className="w-5 h-5 rounded-full border border-gold-500/40 hover:scale-125 transition-transform"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Special Notes & Cutting Instructions */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                  Special Notes & Artisan Instructions
                </label>
                <textarea
                  rows={3}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Mandarin collar, double vents on back, slanted pocket, cuff turn-ups 1.5 inches, high side slits for agbada..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Footer Save Actions */}
              <div className="pt-4 border-t border-gold-500/20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowLivePreview(true)}
                  className="text-xs text-gold-600 dark:text-gold-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Measurement Card</span>
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-obsidian-800 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-white text-xs sm:text-sm font-medium shadow-gold-glow btn-press flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{existingRecord ? 'Update Measurements' : 'Save & Record Measurements'}</span>
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
