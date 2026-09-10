import React, { useState, useEffect } from 'react';
import { Customer, CustomerMeasurementRecord } from './types';
import { DEFAULT_GARMENT_TEMPLATES } from './data/initialData';
import { useTailorStore } from './store/useTailorStore';
import { Header } from './components/Header';
import { CustomerCard } from './components/CustomerCard';
import { CustomerModal } from './components/CustomerModal';
import { MeasurementModal } from './components/MeasurementModal';
import { ExportModal } from './components/ExportModal';
import { GarmentManagerModal } from './components/GarmentManagerModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { LuxuryMeasurementCard } from './components/LuxuryMeasurementCard';
import { 
  Plus, 
  Scissors, 
  Sparkles, 
  Users, 
  Ruler, 
  Share2, 
  Edit3, 
  Phone, 
  Filter, 
  MessageSquare, 
  Clock, 
  Trash2,
  Search,
  ArrowLeft
} from 'lucide-react';

export const App: React.FC = () => {
  // Global Zustand store
  const {
    customers,
    selectedCustomerId,
    searchTerm,
    selectedTag,
    mobileView,
    syncStatus,
    initStore,
    setSelectedCustomerId,
    setSearchTerm,
    setSelectedTag,
    setMobileView,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    saveMeasurement,
    deleteMeasurement,
    restoreCustomers,
  } = useTailorStore();

  // Modals local UI state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [targetCustomerForMeasurement, setTargetCustomerForMeasurement] = useState<Customer | null>(null);
  const [editingMeasurementRecord, setEditingMeasurementRecord] = useState<CustomerMeasurementRecord | null>(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportCustomer, setExportCustomer] = useState<Customer | null>(null);
  const [exportRecord, setExportRecord] = useState<CustomerMeasurementRecord | null>(null);

  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Active selected measurement record index for the selected customer
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);

  // Initialize real-time synchronization on startup
  useEffect(() => {
    initStore();
  }, [initStore]);

  // Selected customer object
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0] || null;

  // Selected record or fallback to latest
  const activeRecord = selectedCustomer?.measurements.find(m => m.id === activeRecordId) || 
    (selectedCustomer?.measurements.length ? selectedCustomer.measurements[selectedCustomer.measurements.length - 1] : null);

  // Total metrics
  const totalMeasurements = customers.reduce((acc, c) => acc + c.measurements.length, 0);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(
      customers.flatMap(c => c.tags || [])
    )
  );

  // Filter customers by search and tags
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.measurements.some(m => 
        m.stylePreference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.fabricType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.specialNotes.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTag = selectedTag === 'all' || (c.tags && c.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  // Customer handlers
  const handleSaveCustomer = async (customerData: Partial<Customer>) => {
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, customerData);
    } else {
      const created = await addCustomer(customerData);
      // Automatically prompt to take measurements for the newly registered client
      setTimeout(() => {
        setTargetCustomerForMeasurement(created);
        setEditingMeasurementRecord(null);
        setIsMeasurementModalOpen(true);
      }, 300);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    await deleteCustomer(customerId);
  };

  // Measurement handlers
  const handleSaveMeasurement = async (customerId: string, record: CustomerMeasurementRecord) => {
    await saveMeasurement(customerId, record);
    setActiveRecordId(record.id);
  };

  const handleDeleteMeasurement = async (customerId: string, recordId: string) => {
    if (!confirm('Are you sure you want to delete this measurement record?')) return;
    await deleteMeasurement(customerId, recordId);
  };

  const openExportForRecord = (customer: Customer, record: CustomerMeasurementRecord) => {
    setExportCustomer(customer);
    setExportRecord(record);
    setIsExportModalOpen(true);
  };

  const openExportLatest = (customer: Customer) => {
    const latest = customer.measurements[customer.measurements.length - 1];
    if (latest) {
      openExportForRecord(customer, latest);
    } else {
      alert('This customer has no measurements recorded yet.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-obsidian-950 text-neutral-900 dark:text-neutral-100 flex flex-col selection:bg-gold-500/20 selection:text-gold-700">
      
      {/* Apple HIG Frosted Top Bar with Live Sync Status */}
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewCustomer={() => {
          setEditingCustomer(null);
          setIsCustomerModalOpen(true);
        }}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        customerCount={customers.length}
        measurementCount={totalMeasurements}
        syncStatus={syncStatus}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {/* Luxury Atelier Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-6 sm:mb-8 border border-gold-500/30 p-5 sm:p-10 shadow-apple-elevated bg-gradient-to-r from-[#1C1B18] via-[#2A261F] to-[#141414] text-white">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 opacity-10 pointer-events-none">
            <img src="/assets/logo.png" alt="" className="w-full h-full object-contain filter invert" />
          </div>

          <div className="relative z-10 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>Atelier Haute Couture Edition</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2 leading-tight">
              Bespoke Tailoring <span className="gold-gradient-text italic font-normal">& Precision</span>
            </h2>

            <p className="font-script text-xl sm:text-2xl lg:text-3xl text-gold-400 mb-5 sm:mb-6 font-normal">
              Every cut measured to royal perfection
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
              <button
                onClick={() => {
                  setEditingCustomer(null);
                  setIsCustomerModalOpen(true);
                }}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:from-gold-300 hover:to-amber-500 text-neutral-950 font-bold shadow-gold-glow flex items-center gap-2 transition-all btn-press text-xs sm:text-sm"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Register New Client</span>
              </button>

              {selectedCustomer && (
                <button
                  onClick={() => {
                    setTargetCustomerForMeasurement(selectedCustomer);
                    setEditingMeasurementRecord(null);
                    setIsMeasurementModalOpen(true);
                  }}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold-400/40 text-white font-medium flex items-center gap-2 transition-all backdrop-blur-sm btn-press text-xs sm:text-sm"
                >
                  <Ruler className="w-4 h-4 text-gold-400" />
                  <span>Take Measurement ({selectedCustomer.name.split(' ')[0]})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="relative md:hidden mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-600/70 dark:text-gold-400/70 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients, styles, fabrics..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 shadow-sm"
          />
        </div>

        {/* Mobile View Mode Switcher (Clients vs Studio) */}
        <div className="lg:hidden flex items-center p-1 bg-gold-500/10 dark:bg-obsidian-900 rounded-2xl border border-gold-500/20 mb-5 shadow-sm">
          <button
            onClick={() => setMobileView('portfolio')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileView === 'portfolio'
                ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-gold-600'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Clients ({filteredCustomers.length})</span>
          </button>

          <button
            onClick={() => setMobileView('studio')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileView === 'studio'
                ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-gold-600'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="truncate max-w-[130px]">{selectedCustomer?.name ? selectedCustomer.name.split(' ')[0] + "'s Slip" : 'Measurement Slip'}</span>
          </button>
        </div>

        {/* Filter Bar & Tags */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-gold-500" /> Filter:
            </span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shrink-0 ${
                selectedTag === 'all'
                  ? 'bg-gold-500 text-white shadow-sm'
                  : 'bg-white dark:bg-obsidian-900 text-neutral-600 dark:text-neutral-300 border border-gold-500/20 hover:border-gold-500/40'
              }`}
            >
              All Clients ({customers.length})
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  selectedTag === tag
                    ? 'bg-gold-500 text-white shadow-sm'
                    : 'bg-white dark:bg-obsidian-900 text-neutral-600 dark:text-neutral-300 border border-gold-500/20 hover:border-gold-500/40'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-500 dark:text-neutral-400 self-end sm:self-center">
            Showing <strong className="text-neutral-900 dark:text-neutral-100">{filteredCustomers.length}</strong> registered clients
          </div>
        </div>

        {/* Master-Detail Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Customer Directory (5 cols on lg) */}
          <div className={`space-y-4 lg:col-span-5 ${mobileView === 'portfolio' ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between px-1">
              <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-gold-500" />
                <span>Client Portfolio</span>
              </h3>

              <button
                onClick={() => {
                  setEditingCustomer(null);
                  setIsCustomerModalOpen(true);
                }}
                className="text-xs text-gold-600 dark:text-gold-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Client</span>
              </button>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="bg-white/60 dark:bg-obsidian-900/60 rounded-3xl p-8 text-center border border-dashed border-gold-500/30">
                <Scissors className="w-8 h-8 text-gold-500/50 mx-auto mb-2" />
                <p className="font-serif text-base font-bold text-neutral-700 dark:text-neutral-300">
                  {customers.length === 0 ? 'No clients in atelier yet' : 'No clients match your search'}
                </p>
                <p className="text-xs text-neutral-400 mt-1 mb-4">
                  {customers.length === 0 ? 'Register your first client to start recording bespoke measurements.' : 'Try adjusting the filter or search keyword.'}
                </p>
                {customers.length === 0 ? (
                  <button
                    onClick={() => {
                      setEditingCustomer(null);
                      setIsCustomerModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-white text-xs font-semibold shadow-gold-glow btn-press"
                  >
                    Register First Client
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTag('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-gold-500/10 text-gold-700 dark:text-gold-300 text-xs font-semibold"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {filteredCustomers.map(customer => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    isSelected={selectedCustomer?.id === customer.id}
                    onSelect={(c) => {
                      setSelectedCustomerId(c.id);
                      setActiveRecordId(null);
                      setMobileView('studio');
                    }}
                    onEditCustomer={(c) => {
                      setEditingCustomer(c);
                      setIsCustomerModalOpen(true);
                    }}
                    onNewMeasurement={(c) => {
                      setTargetCustomerForMeasurement(c);
                      setEditingMeasurementRecord(null);
                      setIsMeasurementModalOpen(true);
                    }}
                    onExportLatest={openExportLatest}
                    onDeleteCustomer={handleDeleteCustomer}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Selected Client Detailed Studio & Measurement Slips (7 cols on lg) */}
          <div className={`space-y-6 lg:col-span-7 ${mobileView === 'studio' ? 'block' : 'hidden lg:block'}`}>
            {/* Mobile Back Button */}
            <div className="lg:hidden flex items-center justify-between bg-gold-500/10 dark:bg-obsidian-900 p-2.5 rounded-2xl border border-gold-500/20">
              <button
                onClick={() => setMobileView('portfolio')}
                className="text-xs font-semibold text-gold-700 dark:text-gold-300 flex items-center gap-1.5 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Clients</span>
              </button>
              <span className="text-[11px] font-mono text-neutral-400">
                {selectedCustomer?.name}
              </span>
            </div>

            {selectedCustomer ? (
              <div className="space-y-6">
                
                {/* Client Profile Banner */}
                <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-gold-500/25 shadow-sm text-left">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gold-500/15">
                    <div className="flex items-center space-x-3.5 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 p-0.5 shadow-gold-glow flex items-center justify-center shrink-0">
                        <div className="w-full h-full bg-[#1C1B18] rounded-[14px] flex items-center justify-center font-serif text-lg sm:text-xl font-bold text-gold-400">
                          {selectedCustomer.name.slice(0, 2).toUpperCase()}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                            {selectedCustomer.name}
                          </h2>
                          {selectedCustomer.tags?.map(t => (
                            <span key={t} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-gold-500/15 text-gold-700 dark:text-gold-300 border border-gold-500/25">
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gold-500" />
                            {selectedCustomer.phone || 'No phone'}
                          </span>
                          {selectedCustomer.email && (
                            <span className="hidden sm:inline">• {selectedCustomer.email}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Quick Call / WhatsApp / Edit buttons */}
                    <div className="flex items-center space-x-2">
                      {selectedCustomer.phone && (
                        <a
                          href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-700 dark:text-emerald-400 border border-emerald-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors btn-press"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      <button
                        onClick={() => {
                          setEditingCustomer(selectedCustomer);
                          setIsCustomerModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-700 dark:text-gold-300 border border-gold-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors btn-press"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          setTargetCustomerForMeasurement(selectedCustomer);
                          setEditingMeasurementRecord(null);
                          setIsMeasurementModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-white text-xs font-bold shadow-gold-glow flex items-center gap-1.5 transition-all btn-press"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Fitting</span>
                      </button>
                    </div>
                  </div>

                  {/* Fitting History Timeline Tabs */}
                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-gold-500" /> Records ({selectedCustomer.measurements.length}):
                      </span>

                      {selectedCustomer.measurements.map((m, idx) => (
                        <button
                          key={m.id}
                          onClick={() => setActiveRecordId(m.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                            activeRecord?.id === m.id
                              ? 'bg-gold-500 text-white shadow-sm font-bold'
                              : 'bg-neutral-100 dark:bg-obsidian-850 text-neutral-600 dark:text-neutral-300 hover:bg-gold-500/15'
                          }`}
                        >
                          <span>{m.stylePreference || `Fitting #${idx + 1}`}</span>
                          <span className="text-[10px] opacity-75 font-mono">({m.dateRef})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Display the active measurement record in Luxury Card format */}
                {activeRecord ? (
                  <div className="space-y-4">
                    {/* Control Bar for the Card */}
                    <div className="flex items-center justify-between bg-white/70 dark:bg-obsidian-900/70 p-3 rounded-2xl border border-gold-500/20 shadow-sm">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="font-serif font-bold text-neutral-800 dark:text-neutral-200">
                          {activeRecord.stylePreference}
                        </span>
                        <span className="text-neutral-400">•</span>
                        <span className="text-gold-600 dark:text-gold-400 font-mono">{activeRecord.dateRef}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setTargetCustomerForMeasurement(selectedCustomer);
                            setEditingMeasurementRecord(activeRecord);
                            setIsMeasurementModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-700 dark:text-gold-300 text-xs font-semibold flex items-center gap-1 transition-colors btn-press"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteMeasurement(selectedCustomer.id, activeRecord.id)}
                          className="p-1.5 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors btn-press"
                          title="Delete this fitting record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => openExportForRecord(selectedCustomer, activeRecord)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-white text-xs font-bold shadow-gold-glow flex items-center gap-1.5 transition-all btn-press"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Download / Share Card</span>
                        </button>
                      </div>
                    </div>

                    {/* The Full Rendered Luxury Measurement Card */}
                    <div className="flex justify-center">
                      <LuxuryMeasurementCard
                        customer={selectedCustomer}
                        record={activeRecord}
                        variant="auto"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/60 dark:bg-obsidian-900/60 rounded-3xl p-12 text-center border border-dashed border-gold-500/30">
                    <Ruler className="w-12 h-12 text-gold-500/50 mx-auto mb-3" />
                    <h3 className="font-serif text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                      No Measurements Recorded Yet
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-6">
                      Take precision measurements for {selectedCustomer.name} (Top, Trouser, Agbada, Kaftan, Suit, etc.) and generate a downloadable luxury card.
                    </p>
                    <button
                      onClick={() => {
                        setTargetCustomerForMeasurement(selectedCustomer);
                        setEditingMeasurementRecord(null);
                        setIsMeasurementModalOpen(true);
                      }}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 text-white font-bold text-xs sm:text-sm shadow-gold-glow btn-press inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Take Measurements Now</span>
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white/60 dark:bg-obsidian-900/60 rounded-3xl p-12 text-center border border-dashed border-gold-500/30">
                <Ruler className="w-12 h-12 text-gold-500/50 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                  Atelier Measurement Studio
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-6">
                  Select or register a client to begin recording bespoke fittings and generating luxury measurement slips.
                </p>
                <button
                  onClick={() => {
                    setEditingCustomer(null);
                    setIsCustomerModalOpen(true);
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 text-white font-bold text-xs sm:text-sm shadow-gold-glow btn-press inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Register New Client</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gold-500/20 py-6 bg-white/40 dark:bg-obsidian-950/60 text-center text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-sm gold-gradient-text">LARRÉ LUXE</span>
          </div>
          <div className="text-[11px] font-mono opacity-80">
            Crafted for Master Tailors
          </div>
        </div>
      </footer>

      {/* All Interactive Modals */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
        initialData={editingCustomer}
      />

      <MeasurementModal
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
        onSave={handleSaveMeasurement}
        customer={targetCustomerForMeasurement}
        existingRecord={editingMeasurementRecord}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        customer={exportCustomer}
        record={exportRecord}
      />

      <GarmentManagerModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        templates={DEFAULT_GARMENT_TEMPLATES}
      />

      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        customers={customers}
        onRestore={restoreCustomers}
      />

    </div>
  );
};

export default App;
