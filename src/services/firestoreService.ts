import { 
  collection, 
  doc, 
  setDoc, 
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
