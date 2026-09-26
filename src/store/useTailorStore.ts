import { create } from 'zustand';
import { Customer, CustomerMeasurementRecord, ClientSubmissionData } from '../types';
import {
  subscribeToCustomers,
  createCustomerDoc,
  updateCustomerDoc,
  deleteCustomerDoc,
  saveCustomerMeasurementDoc,
  deleteCustomerMeasurementDoc,
  restoreCustomersBatch,
  saveClientSelfMeasurement,
} from '../services/firestoreService';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface TailorState {
  customers: Customer[];
  selectedCustomerId: string | null;
  searchTerm: string;
  selectedTag: string;
  mobileView: 'portfolio' | 'studio';
  isLoading: boolean;
  syncStatus: SyncStatus;
  errorMessage: string | null;
  unsubscribeSnapshot: (() => void) | null;

  // Authentication & Security
  isUnlocked: boolean;
  masterPasscode: string;
  unlockApp: (passcode: string) => boolean;
  lockApp: () => void;
  setMasterPasscode: (newCode: string) => void;

  // Actions
  initStore: () => void;
  setSelectedCustomerId: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setSelectedTag: (tag: string) => void;
  setMobileView: (view: 'portfolio' | 'studio') => void;
  
  // Database operations
  addCustomer: (customerData: Partial<Customer>) => Promise<Customer>;
  updateCustomer: (customerId: string, customerData: Partial<Customer>) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  saveMeasurement: (customerId: string, record: CustomerMeasurementRecord) => Promise<void>;
  deleteMeasurement: (customerId: string, recordId: string) => Promise<void>;
  restoreCustomers: (importedCustomers: Customer[]) => Promise<void>;
  submitClientSelfMeasurement: (data: ClientSubmissionData) => Promise<Customer>;
}


export const useTailorStore = create<TailorState>((set, get) => ({
  customers: (() => {
    // Initial local cache fallback
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('larre_luxe_customers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          // fallback
        }
      }
    }
    return [];
  })(),
  selectedCustomerId: null,
  searchTerm: '',
  selectedTag: 'all',
  mobileView: 'portfolio',
  isLoading: true,
  syncStatus: 'syncing',
  errorMessage: null,
  unsubscribeSnapshot: null,

  // Authentication initial state
  isUnlocked: typeof window !== 'undefined' ? sessionStorage.getItem('larre_luxe_unlocked') === 'true' : false,
  masterPasscode: typeof window !== 'undefined' ? localStorage.getItem('larre_luxe_passcode') || '1926' : '1926',

  unlockApp: (passcode: string) => {
    const currentPasscode = get().masterPasscode;
    if (passcode.trim() === currentPasscode.trim()) {
      set({ isUnlocked: true });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('larre_luxe_unlocked', 'true');
      }
      return true;
    }
    return false;
  },

  lockApp: () => {
    set({ isUnlocked: false });
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('larre_luxe_unlocked');
    }
  },

  setMasterPasscode: (newCode: string) => {
    const trimmed = newCode.trim();
    if (trimmed.length >= 4) {
      set({ masterPasscode: trimmed });
      if (typeof window !== 'undefined') {
        localStorage.setItem('larre_luxe_passcode', trimmed);
      }
    }
  },


  initStore: () => {
    // Clean up existing listener if any
    const currentUnsub = get().unsubscribeSnapshot;
    if (currentUnsub) {
      currentUnsub();
    }

    set({ isLoading: true, syncStatus: 'syncing' });

    // Start real-time cloud synchronization
    const unsubscribe = subscribeToCustomers(
      (cloudCustomers) => {
        set({
          customers: cloudCustomers,
          isLoading: false,
          syncStatus: 'synced',
          errorMessage: null,
        });
        // Update local cache
        localStorage.setItem('larre_luxe_customers', JSON.stringify(cloudCustomers));

        // Set default selected customer if none selected or selected was removed
        const currentSelected = get().selectedCustomerId;
        if (!currentSelected || !cloudCustomers.some((c) => c.id === currentSelected)) {
          set({ selectedCustomerId: cloudCustomers[0]?.id || null });
        }
      },
      (error) => {
        console.warn('Real-time subscription offline, using local cache:', error);
        set({
          isLoading: false,
          syncStatus: 'offline',
          errorMessage: 'Offline mode — using local storage cache',
        });
      }
    );

    set({ unsubscribeSnapshot: unsubscribe });
  },

  setSelectedCustomerId: (id) => set({ selectedCustomerId: id }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setMobileView: (view) => set({ mobileView: view }),

  addCustomer: async (customerData) => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: customerData.name || 'New Client',
      phone: customerData.phone || '',
      email: customerData.email || '',
      address: customerData.address || '',
      tags: customerData.tags || ['Bespoke'],
      measurements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic local update
    const prev = get().customers;
    const updated = [newCust, ...prev];
    set({
      customers: updated,
      selectedCustomerId: newCust.id,
      syncStatus: 'syncing',
    });
    localStorage.setItem('larre_luxe_customers', JSON.stringify(updated));

    // Cloud persist
    try {
      await createCustomerDoc(newCust);
      set({ syncStatus: 'synced' });
    } catch (err) {
      console.warn('Cloud save failed, kept in local storage:', err);
      set({ syncStatus: 'offline' });
    }

    return newCust;
  },

  updateCustomer: async (customerId, customerData) => {
    const prev = get().customers;
    const updated = prev.map((c) =>
      c.id === customerId
        ? { ...c, ...customerData, updatedAt: new Date().toISOString() }
        : c
    );

    set({ customers: updated, syncStatus: 'syncing' });
    localStorage.setItem('larre_luxe_customers', JSON.stringify(updated));

    try {
      await updateCustomerDoc(customerId, customerData);
      set({ syncStatus: 'synced' });
    } catch (err) {
      console.warn('Cloud update failed, kept in local storage:', err);
      set({ syncStatus: 'offline' });
    }
  },

  deleteCustomer: async (customerId) => {
    const prev = get().customers;
    const updated = prev.filter((c) => c.id !== customerId);
    
    let nextSelected = get().selectedCustomerId;
    if (nextSelected === customerId) {
      nextSelected = updated[0]?.id || null;
    }

    set({
      customers: updated,
      selectedCustomerId: nextSelected,
      syncStatus: 'syncing',
    });
    localStorage.setItem('larre_luxe_customers', JSON.stringify(updated));

    try {
      await deleteCustomerDoc(customerId);
      set({ syncStatus: 'synced' });
    } catch (err) {
      console.warn('Cloud delete failed:', err);
      set({ syncStatus: 'offline' });
    }
  },

  saveMeasurement: async (customerId, record) => {
    const targetCustomer = get().customers.find((c) => c.id === customerId);
    if (!targetCustomer) return;

    // Optimistic update
    const existingIdx = targetCustomer.measurements.findIndex((m) => m.id === record.id);
    let updatedMeasurements: CustomerMeasurementRecord[];
    if (existingIdx >= 0) {
      updatedMeasurements = targetCustomer.measurements.map((m, idx) =>
        idx === existingIdx ? record : m
      );
    } else {
      updatedMeasurements = [...targetCustomer.measurements, record];
    }

    const updatedCustomer: Customer = {
      ...targetCustomer,
      measurements: updatedMeasurements,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = get().customers.map((c) =>
      c.id === customerId ? updatedCustomer : c
    );

    set({ customers: updatedList, syncStatus: 'syncing' });
    localStorage.setItem('larre_luxe_customers', JSON.stringify(updatedList));

    try {
      await saveCustomerMeasurementDoc(targetCustomer, record);
      set({ syncStatus: 'synced' });
    } catch (err) {
      console.warn('Cloud measurement save failed:', err);
      set({ syncStatus: 'offline' });
    }
  },

  deleteMeasurement: async (customerId, recordId) => {
    const targetCustomer = get().customers.find((c) => c.id === customerId);
    if (!targetCustomer) return;

    const updatedMeasurements = targetCustomer.measurements.filter(
      (m) => m.id !== recordId
    );

    const updatedCustomer: Customer = {
      ...targetCustomer,
      measurements: updatedMeasurements,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = get().customers.map((c) =>
      c.id === customerId ? updatedCustomer : c
    );

    set({ customers: updatedList, syncStatus: 'syncing' });
    localStorage.setItem('larre_luxe_customers', JSON.stringify(updatedList));

    try {
      await deleteCustomerMeasurementDoc(targetCustomer, recordId);
      set({ syncStatus: 'synced' });
    } catch (err) {
      console.warn('Cloud measurement delete failed:', err);
      set({ syncStatus: 'offline' });
    }
  },

  restoreCustomers: async (importedCustomers) => {
    set({
      customers: importedCustomers,
      selectedCustomerId: importedCustomers[0]?.id || null,
      syncStatus: 'syncing',
    });
    localStorage.setItem('larre_luxe_customers', JSON.stringify(importedCustomers));

    try {
      await restoreCustomersBatch(importedCustomers);
      set({ syncStatus: 'synced' });
    } catch (err) {
      console.warn('Cloud restore batch failed:', err);
      set({ syncStatus: 'offline' });
    }
  },

  submitClientSelfMeasurement: async (submissionData) => {
    set({ syncStatus: 'syncing' });
    try {
      const savedCustomer = await saveClientSelfMeasurement(submissionData);
      
      // Update local state
      const currentList = get().customers;
      const existingIndex = currentList.findIndex(c => c.id === savedCustomer.id);
      let updatedList: Customer[];
      if (existingIndex >= 0) {
        updatedList = currentList.map(c => c.id === savedCustomer.id ? savedCustomer : c);
      } else {
        updatedList = [savedCustomer, ...currentList];
      }

      set({ 
        customers: updatedList, 
        selectedCustomerId: savedCustomer.id,
        syncStatus: 'synced' 
      });
      localStorage.setItem('larre_luxe_customers', JSON.stringify(updatedList));
      return savedCustomer;
    } catch (err) {
      console.warn('Failed to submit client self measurement:', err);
      set({ syncStatus: 'offline' });
      throw err;
    }
  },
}));

