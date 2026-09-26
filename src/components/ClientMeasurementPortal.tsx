import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Phone, 
  Mail, 
  Ruler, 
  HelpCircle, 
  Send, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Palette 
} from 'lucide-react';
import { DEFAULT_GARMENT_TEMPLATES } from '../data/initialData';
import { SELF_MEASUREMENT_GUIDES } from '../data/selfMeasurementGuides';
import { GarmentSection, FitPreference, ClientSubmissionData } from '../types';
import { useTailorStore } from '../store/useTailorStore';
import { getCustomerDoc } from '../services/firestoreService';

const FRACTION_OPTIONS = [
  { label: '0"', value: 0 },
  { label: '⅛"', value: 0.125 },
  { label: '¼"', value: 0.25 },
  { label: '⅜"', value: 0.375 },
  { label: '½"', value: 0.5 },
  { label: '⅝"', value: 0.625 },
  { label: '¾"', value: 0.75 },
  { label: '⅞"', value: 0.875 },
];

const FIT_OPTIONS: FitPreference[] = [
  'Slim Fit',
  'Bespoke Tailored',
  'Regular Fit',
  'Relaxed Fit',
  'Loose Fit',
];

interface ClientMeasurementPortalProps {
  initialCustomerId?: string | null;
}

export const ClientMeasurementPortal: React.FC<ClientMeasurementPortalProps> = ({
  initialCustomerId,
}) => {
  const { submitClientSelfMeasurement } = useTailorStore();

  // Wizard Steps
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);


  // Client info
  const [customerId, setCustomerId] = useState<string | undefined>(initialCustomerId || undefined);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Garment selection & configuration
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('senator-outfit');
  const [stylePreference, setStylePreference] = useState('Senator Suit & Trouser');
  const [fitPreference, setFitPreference] = useState<FitPreference>('Bespoke Tailored');
  const [fabricType, setFabricType] = useState('Italian Wool / Cashmere');
  const [color, setColor] = useState('Midnight Navy');
  const [specialNotes, setSpecialNotes] = useState('');
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);

  // Measurements structure
  const [sections, setSections] = useState<GarmentSection[]>([]);

  // Load customer info if customerId is present in URL
  useEffect(() => {
    if (initialCustomerId) {
      getCustomerDoc(initialCustomerId).then((cust) => {
        if (cust) {
          setName(cust.name);
          setPhone(cust.phone || '');
          setEmail(cust.email || '');
          setCustomerId(cust.id);
        }
      });
    }
  }, [initialCustomerId]);

  // Initialize garment sections based on template
  useEffect(() => {
    const tpl = DEFAULT_GARMENT_TEMPLATES.find((t) => t.id === selectedTemplateId) || DEFAULT_GARMENT_TEMPLATES[0];
    if (tpl) {
      setStylePreference(tpl.name);
      setSections(
        tpl.defaultSections.map((s, sIdx) => ({
          id: `sec-${sIdx}-${Date.now()}`,
          name: s.name,
          fields: s.fields.map((f) => ({
            id: f.id,
            label: f.label,
            value: '',
            unit: 'in',
            hint: f.placeholder,
          })),
        }))
      );
    }
  }, [selectedTemplateId]);

  // Measurement value updater with fraction helper
  const handleUpdateFieldValue = (sectionIdx: number, fieldIdx: number, val: string) => {
    setSections((prev) => {
      const updated = [...prev];
      const targetSec = { ...updated[sectionIdx] };
      const targetFields = [...targetSec.fields];
      targetFields[fieldIdx] = {
        ...targetFields[fieldIdx],
        value: val,
      };
      targetSec.fields = targetFields;
      updated[sectionIdx] = targetSec;
      return updated;
    });
  };

  const handleApplyFraction = (sectionIdx: number, fieldIdx: number, fracVal: number) => {
    const currentValStr = sections[sectionIdx]?.fields[fieldIdx]?.value || '0';
    const intPart = Math.floor(parseFloat(currentValStr) || 0);
    const newVal = fracVal === 0 ? `${intPart}` : `${intPart + fracVal}`;
    handleUpdateFieldValue(sectionIdx, fieldIdx, newVal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please provide your full name.');
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData: ClientSubmissionData = {
        customerId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        stylePreference,
        fitPreference,
        fabricType,
        color,
        garmentSections: sections,
        specialNotes,
      };

      await submitClientSelfMeasurement(submissionData);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Unable to submit measurements. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }

  };

  // Generate WhatsApp message for client to send to tailor
  const getWhatsAppShareLink = () => {
    const filledFields = sections.flatMap((s) =>
      s.fields
        .filter((f) => f.value && f.value.trim() !== '')
        .map((f) => `• ${f.label}: ${f.value}"`)
    );

    const message = `👑 *Larré Luxe Bespoke Measurements Submission*
---------------------------------------
👤 *Client:* ${name}
📱 *Phone:* ${phone || 'N/A'}
✂️ *Style:* ${stylePreference}
📐 *Fit:* ${fitPreference}
🧵 *Fabric:* ${fabricType} (${color})

*Measurements:*
${filledFields.join('\n')}

${specialNotes ? `*Notes:* ${specialNotes}\n` : ''}
---------------------------------------
_Recorded via Larré Luxe Client Self-Service Portal_`;

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  // If submitted, show royal confirmation screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0E0C] via-[#171613] to-[#0A0908] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-lg glass-panel border border-gold-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600" />

          {/* Success Crest */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 p-0.5 shadow-gold-glow mb-5 flex items-center justify-center">
            <div className="w-full h-full bg-[#1C1B18] rounded-[14px] flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/30 text-xs font-semibold uppercase tracking-widest mb-3">
            Measurements Received
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
            Thank You, {name.split(' ')[0]}
          </h1>
          <p className="text-sm text-neutral-300 mb-6 font-light">
            Your bespoke garment specifications have been securely transmitted to the <span className="text-gold-400 font-semibold">Larré Luxe Atelier</span>.
          </p>

          {/* Summary Box */}
          <div className="bg-white/5 rounded-2xl p-4 border border-gold-500/20 text-left mb-6 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Garment Style:</span>
              <span className="text-white font-medium">{stylePreference}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Fit Preference:</span>
              <span className="text-gold-400 font-medium">{fitPreference}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Fabric & Color:</span>
              <span className="text-white font-medium">{fabricType} • {color}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Total Fitted Points:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {sections.reduce((acc, s) => acc + s.fields.filter(f => f.value).length, 0)} Points
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href={getWhatsAppShareLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 btn-press"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share Summary to Tailor on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setStep(1);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Submit Another Outfit</span>
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
            <Scissors className="w-3.5 h-3.5 text-gold-500" />
            <span>Larré Luxe Haute Couture • Royal Perfection</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0C0A] via-[#141310] to-[#0A0908] text-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Portal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 p-0.5 shadow-gold-glow mb-1">
            <div className="w-full h-full bg-[#1C1B18] rounded-[14px] flex items-center justify-center">
              <Scissors className="w-7 h-7 text-gold-400" />
            </div>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            <span className="gold-gradient-text">Larré Luxe</span> Client Portal
          </h1>
          <p className="font-script text-lg sm:text-xl text-gold-400/90 font-normal">
            Bespoke Self-Measurement & Garment Slip
          </p>
        </div>

        {/* Step Progress Pills */}
        <div className="grid grid-cols-4 gap-2 bg-white/5 p-1.5 rounded-2xl border border-gold-500/20 backdrop-blur-md">
          {[
            { num: 1, label: 'Client' },
            { num: 2, label: 'Style' },
            { num: 3, label: 'Measure' },
            { num: 4, label: 'Submit' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => {
                if (step > s.num) setStep(s.num as any);
              }}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                step === s.num
                  ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-neutral-950 font-bold shadow-gold-glow'
                  : step > s.num
                  ? 'bg-white/10 text-gold-400'
                  : 'text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>{s.num}.</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* STEP 1: Client Personal Details */}
        {step === 1 && (
          <div className="glass-panel border border-gold-500/25 rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
            <div className="border-b border-gold-500/15 pb-4">
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-gold-400" />
                <span>Your Contact Information</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your details so the master tailor can link these measurements to your bespoke profile.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400/90 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chief Babatunde Adeleke"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-gold-500/30 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 text-white placeholder:text-neutral-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400/90 mb-1.5">
                    WhatsApp / Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 801 234 5678"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-gold-500/30 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 text-white placeholder:text-neutral-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400/90 mb-1.5">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@luxury.com"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-gold-500/30 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 text-white placeholder:text-neutral-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!name.trim()) {
                    alert('Please enter your full name to proceed.');
                    return;
                  }
                  setStep(2);
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:from-gold-300 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-gold-glow flex items-center gap-2 btn-press"
              >
                <span>Select Garment Style</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Garment Template & Fit Choice */}
        {step === 2 && (
          <div className="glass-panel border border-gold-500/25 rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
            <div className="border-b border-gold-500/15 pb-4">
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-gold-400" />
                <span>Choose Your Garment Type & Fit</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Select the outfit template and how you prefer the cut to drape over your body.
              </p>
            </div>

            {/* Garment Templates Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400/90">
                Garment Silhouette
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEFAULT_GARMENT_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedTemplateId === tpl.id
                        ? 'bg-gold-500/15 border-gold-400 ring-2 ring-gold-400/30'
                        : 'bg-white/5 border-white/10 hover:border-gold-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-serif text-sm font-bold text-white">{tpl.name}</h3>
                      {selectedTemplateId === tpl.id && (
                        <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2">{tpl.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Fit Preference Pills */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400/90">
                Fit & Silhouette Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {FIT_OPTIONS.map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => setFitPreference(fit)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                      fitPreference === fit
                        ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-neutral-950 font-bold border-gold-400 shadow-gold-glow'
                        : 'bg-white/5 border-white/10 text-neutral-300 hover:border-gold-500/30'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gold-500/15">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:from-gold-300 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-gold-glow flex items-center gap-2 btn-press"
              >
                <span>Enter Measurements</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Self-Measurement Form with Guidance & Fraction Chips */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            {/* Guide Popover Card */}
            {activeGuideId && SELF_MEASUREMENT_GUIDES[activeGuideId] && (
              <div className="glass-panel border-2 border-gold-400/80 rounded-3xl p-5 shadow-2xl bg-obsidian-950/95 relative animate-fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
                    <h3 className="font-serif text-base font-bold text-gold-300">
                      How to Measure: {SELF_MEASUREMENT_GUIDES[activeGuideId].name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveGuideId(null)}
                    className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded-lg bg-white/10"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="text-xs text-neutral-200 mb-2 leading-relaxed">
                  {SELF_MEASUREMENT_GUIDES[activeGuideId].instructions}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-gold-400/90 pt-2 border-t border-gold-500/20">
                  <span>💡 <strong>Tip:</strong> {SELF_MEASUREMENT_GUIDES[activeGuideId].tips}</span>
                  <span className="font-mono text-neutral-400">Typical: {SELF_MEASUREMENT_GUIDES[activeGuideId].commonRange}</span>
                </div>
              </div>
            )}

            {/* Sections Accordion / Cards */}
            {sections.map((section, sIdx) => (
              <div key={section.id} className="glass-panel border border-gold-500/25 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-gold-500/15 pb-3">
                  <h3 className="font-serif text-lg font-bold text-gold-400 flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-gold-400" />
                    <span>{section.name} SPECIFICATIONS (Inches)</span>
                  </h3>
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
                    {section.fields.filter(f => f.value).length} / {section.fields.length} filled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.fields.map((field, fIdx) => {
                    const guide = SELF_MEASUREMENT_GUIDES[field.id];
                    return (
                      <div key={field.id} className="bg-white/5 rounded-2xl p-3.5 border border-white/10 hover:border-gold-500/30 transition-all space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                            <span>{field.label}</span>
                            {guide && (
                              <button
                                type="button"
                                onClick={() => setActiveGuideId(field.id)}
                                className="text-gold-400/70 hover:text-gold-400 p-0.5"
                                title="Measurement Guide"
                              >
                                <HelpCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </label>
                          <span className="text-[10px] font-mono text-gold-400 uppercase">Inches</span>
                        </div>

                        {/* Numeric input */}
                        <input
                          type="number"
                          step="0.125"
                          value={field.value}
                          onChange={(e) => handleUpdateFieldValue(sIdx, fIdx, e.target.value)}
                          placeholder="e.g. 38.5"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-gold-500/25 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 text-white font-mono text-sm text-center"
                        />

                        {/* Fraction Quick Chips */}
                        <div className="flex items-center justify-between gap-1 pt-1 overflow-x-auto pb-1">
                          {FRACTION_OPTIONS.slice(0, 5).map((frac) => (
                            <button
                              key={frac.label}
                              type="button"
                              onClick={() => handleApplyFraction(sIdx, fIdx, frac.value)}
                              className="px-1.5 py-0.5 rounded-md bg-white/5 hover:bg-gold-500/20 text-[10px] font-mono text-neutral-400 hover:text-gold-300 border border-white/5 transition-colors"
                            >
                              {frac.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:from-gold-300 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-gold-glow flex items-center gap-2 btn-press"
              >
                <span>Review & Finalize</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Fabric, Occasion & Final Review */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="glass-panel border border-gold-500/25 rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
            <div className="border-b border-gold-500/15 pb-4">
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-gold-400" />
                <span>Fabric, Color & Special Notes</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Provide fabric details or specific styling notes (e.g. pocket styles, button types, event date).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400/90 mb-1.5">
                  Fabric Type / Material
                </label>
                <input
                  type="text"
                  value={fabricType}
                  onChange={(e) => setFabricType(e.target.value)}
                  placeholder="e.g. 7-Star Super 160s Wool, Brocade"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-gold-500/30 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 text-white placeholder:text-neutral-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400/90 mb-1.5">
                  Color / Pattern
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Royal Emerald Green, Charcoal"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-gold-500/30 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 text-white placeholder:text-neutral-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400/90 mb-1.5">
                Special Tailoring Notes / Event Date
              </label>
              <textarea
                rows={3}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Mention any custom requests (e.g., French cuffs, specific embroidery pattern, wedding date on Oct 15th)..."
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-gold-500/30 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 text-white placeholder:text-neutral-500 text-sm resize-none"
              />
            </div>

            {/* Quick Summary Preview */}
            <div className="bg-white/5 rounded-2xl p-4 border border-gold-500/20 space-y-2">
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-gold-400">
                Submission Summary
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px]">CLIENT</span>
                  <span className="text-white font-medium truncate">{name}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">STYLE</span>
                  <span className="text-white font-medium">{stylePreference}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">FIT</span>
                  <span className="text-gold-400 font-medium">{fitPreference}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">MEASUREMENTS</span>
                  <span className="text-emerald-400 font-medium">
                    {sections.reduce((acc, s) => acc + s.fields.filter(f => f.value).length, 0)} Recorded
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gold-500/15">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:from-gold-300 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-gold-glow flex items-center gap-2 btn-press disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting to Atelier...' : 'Submit Measurements'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Discreet Atelier Access Footer */}
        <div className="pt-8 text-center">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = window.location.origin;
              }
            }}
            className="text-[11px] text-neutral-500 hover:text-gold-400 transition-colors inline-flex items-center gap-1"
          >
            <span>Master Atelier Staff Access</span>
          </button>
        </div>

      </div>
    </div>
  );
};

