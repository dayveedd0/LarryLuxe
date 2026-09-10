export interface MeasurementField {
  id: string;
  label: string;
  value: string; // e.g., "16.5", "38.25"
  unit?: string; // default "in"
  hint?: string;
}

export interface GarmentSection {
  id: string;
  name: string; // e.g. "TOP", "TROUSER", "AGBADA", "KAFTAN", "SUIT"
  icon?: string;
  fields: MeasurementField[];
}

export type FitPreference = 'Slim Fit' | 'Regular Fit' | 'Relaxed Fit' | 'Bespoke Tailored' | 'Loose Fit' | 'Custom';

export interface CustomerMeasurementRecord {
  id: string;
  dateRef: string;
  stylePreference: string;
  fitPreference: FitPreference;
  fabricType: string;
  color: string;
  colorHex?: string;
  garmentSections: GarmentSection[];
  specialNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  avatarColor?: string;
  tags?: string[];
  measurements: CustomerMeasurementRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface GarmentTemplate {
  id: string;
  name: string;
  description: string;
  defaultSections: {
    name: string;
    fields: { id: string; label: string; placeholder?: string }[];
  }[];
}
