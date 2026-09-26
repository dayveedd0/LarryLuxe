import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  writeBatch 
} from 'firebase/firestore';

import { db } from './firebase';
import { Customer, CustomerMeasurementRecord } from '../types';

const CUSTOMERS_COLLECTION = 'customers';

/**
 * Real-time subscription to the customers collection
 */
export function subscribeToCustomers(
  onUpdate: (customers: Customer[]) => void,
  onError: (error: Error) => void
) {
  const q = query(
    collection(db, CUSTOMERS_COLLECTION),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const customers: Customer[] = [];
      snapshot.forEach((docSnap) => {
        customers.push(docSnap.data() as Customer);
      });
      onUpdate(customers);
    },
    (error) => {
      console.error('Firestore subscription error:', error);
      onError(error);
    }
  );
}

/**
 * Create or overwrite a customer document
 */
export async function createCustomerDoc(customer: Customer): Promise<void> {
  const docRef = doc(db, CUSTOMERS_COLLECTION, customer.id);
  await setDoc(docRef, customer);
}

/**
 * Update partial customer profile details
 */
export async function updateCustomerDoc(customerId: string, data: Partial<Customer>): Promise<void> {
  const docRef = doc(db, CUSTOMERS_COLLECTION, customerId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Delete a customer document
 */
export async function deleteCustomerDoc(customerId: string): Promise<void> {
  const docRef = doc(db, CUSTOMERS_COLLECTION, customerId);
  await deleteDoc(docRef);
}

/**
 * Save / Update a measurement record for a customer
 */
export async function saveCustomerMeasurementDoc(
  customer: Customer,
  record: CustomerMeasurementRecord
): Promise<void> {
  const existingIdx = customer.measurements.findIndex((m) => m.id === record.id);
  let updatedMeasurements: CustomerMeasurementRecord[];

  if (existingIdx >= 0) {
    updatedMeasurements = customer.measurements.map((m, idx) =>
      idx === existingIdx ? record : m
    );
  } else {
    updatedMeasurements = [...customer.measurements, record];
  }

  const docRef = doc(db, CUSTOMERS_COLLECTION, customer.id);
  await updateDoc(docRef, {
    measurements: updatedMeasurements,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Delete a measurement record for a customer
 */
export async function deleteCustomerMeasurementDoc(
  customer: Customer,
  recordId: string
): Promise<void> {
  const updatedMeasurements = customer.measurements.filter((m) => m.id !== recordId);
  const docRef = doc(db, CUSTOMERS_COLLECTION, customer.id);
  await updateDoc(docRef, {
    measurements: updatedMeasurements,
    updatedAt: new Date().toISOString()
  });
}



/**
 * Fetch a single customer document by ID (useful for client self-service portal lookup)
 */
export async function getCustomerDoc(customerId: string): Promise<Customer | null> {
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, customerId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Customer;
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch customer by ID:', err);
    return null;
  }
}


/**
 * Save client self-submitted measurement
 */
export async function saveClientSelfMeasurement(
  submission: import('../types').ClientSubmissionData
): Promise<Customer> {
  let targetCustomer: Customer | null = null;

  if (submission.customerId) {
    targetCustomer = await getCustomerDoc(submission.customerId);
  }

  const newRecord: CustomerMeasurementRecord = {
    id: `meas-${Date.now()}`,
    dateRef: new Date().toISOString().split('T')[0],
    stylePreference: submission.stylePreference || 'Self-Service Bespoke',
    fitPreference: submission.fitPreference || 'Bespoke Tailored',
    fabricType: submission.fabricType || 'Client Provided',
    color: submission.color || 'Standard',
    garmentSections: submission.garmentSections,
    specialNotes: submission.specialNotes 
      ? `[Client Submitted] ${submission.specialNotes}` 
      : '[Client Submitted via Portal]',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (targetCustomer) {
    // Update existing customer
    await saveCustomerMeasurementDoc(targetCustomer, newRecord);
    if (submission.name && submission.name !== targetCustomer.name) {
      await updateCustomerDoc(targetCustomer.id, {
        name: submission.name,
        phone: submission.phone || targetCustomer.phone,
        email: submission.email || targetCustomer.email,
      });
    }
    return {
      ...targetCustomer,
      measurements: [...targetCustomer.measurements, newRecord],
      updatedAt: new Date().toISOString()
    };
  } else {
    // Create brand new customer
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: submission.name || 'Bespoke Client',
      phone: submission.phone || '',
      email: submission.email || '',
      tags: ['Portal Submission', 'Bespoke'],
      measurements: [newRecord],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await createCustomerDoc(newCustomer);
    return newCustomer;
  }
}

/**
 * Batch restore multiple customers (e.g. from JSON backup)
 */
export async function restoreCustomersBatch(customers: Customer[]): Promise<void> {
  const batch = writeBatch(db);
  customers.forEach((cust) => {
    const docRef = doc(db, CUSTOMERS_COLLECTION, cust.id);
    batch.set(docRef, cust);
  });
  await batch.commit();
}

