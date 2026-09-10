import { Customer, GarmentTemplate, GarmentSection } from '../types';

export const DEFAULT_GARMENT_TEMPLATES: GarmentTemplate[] = [
  {
    id: 'top-and-trouser',
    name: 'Top & Trouser (Standard)',
    description: 'Complete 2-piece set with standard Top and Trouser parameters.',
    defaultSections: [
      {
        name: 'TOP',
        fields: [
          { id: 'neck', label: 'Neck' },
          { id: 'shoulder', label: 'Shoulder' },
          { id: 'chest', label: 'Chest' },
          { id: 'stomach', label: 'Stomach' },
          { id: 'hip', label: 'Hip' },
          { id: 'sleeve', label: 'Sleeve' },
          { id: 'bicep', label: 'Bicep' },
          { id: 'wrist', label: 'Wrist' },
          { id: 'topLength', label: 'Top Length' },
        ]
      },
      {
        name: 'TROUSER',
        fields: [
          { id: 'waist', label: 'Waist' },
          { id: 'hipSeat', label: 'Hip/Seat' },
          { id: 'thigh', label: 'Thigh' },
          { id: 'knee', label: 'Knee' },
          { id: 'crotchRise', label: 'Crotch/Rise' },
          { id: 'trouserLength', label: 'Trouser Length' },
          { id: 'bottom', label: 'Bottom' },
        ]
      }
    ]
  },
  {
    id: 'senator-outfit',
    name: 'Senator / Kaftan Suite',
    description: 'Refined African modern tailoring for Senator outfits and Kaftans.',
    defaultSections: [
      {
        name: 'TOP',
        fields: [
          { id: 'neck', label: 'Neck' },
          { id: 'shoulder', label: 'Shoulder' },
          { id: 'chest', label: 'Chest' },
          { id: 'stomach', label: 'Stomach' },
          { id: 'hip', label: 'Hip' },
          { id: 'sleeve', label: 'Sleeve' },
          { id: 'bicep', label: 'Bicep' },
          { id: 'wrist', label: 'Wrist' },
          { id: 'topLength', label: 'Top Length' },
        ]
      },
      {
        name: 'TROUSER',
        fields: [
          { id: 'waist', label: 'Waist' },
          { id: 'hipSeat', label: 'Hip/Seat' },
          { id: 'thigh', label: 'Thigh' },
          { id: 'knee', label: 'Knee' },
          { id: 'crotchRise', label: 'Crotch/Rise' },
          { id: 'trouserLength', label: 'Trouser Length' },
          { id: 'bottom', label: 'Bottom' },
        ]
      }
    ]
  },
  {
    id: 'royal-agbada',
    name: 'Royal 3-Piece Agbada',
    description: 'Grand Traditional Agbada with inner top and matching trousers.',
    defaultSections: [
      {
        name: 'AGBADA ROBE',
        fields: [
          { id: 'agbadaLength', label: 'Agbada Length' },
          { id: 'agbadaSpan', label: 'Shoulder Span / Wing' },
          { id: 'neckOpening', label: 'Neck Opening / Drop' },
          { id: 'chest', label: 'Chest Room' },
        ]
      },
      {
        name: 'INNER TOP',
        fields: [
          { id: 'neck', label: 'Neck' },
          { id: 'shoulder', label: 'Shoulder' },
          { id: 'chest', label: 'Chest' },
          { id: 'stomach', label: 'Stomach' },
          { id: 'sleeve', label: 'Sleeve Length' },
          { id: 'topLength', label: 'Top Length' },
        ]
      },
      {
        name: 'TROUSER / SOKOTO',
        fields: [
          { id: 'waist', label: 'Waist' },
          { id: 'hipSeat', label: 'Hip/Seat' },
          { id: 'thigh', label: 'Thigh' },
          { id: 'crotchRise', label: 'Crotch/Rise' },
          { id: 'trouserLength', label: 'Trouser Length' },
          { id: 'bottom', label: 'Bottom / Ankle' },
        ]
      }
    ]
  },
  {
    id: 'bespoke-suit',
    name: 'Bespoke Suit & Blazer',
    description: 'Modern jacket, waistcoat, and tailored dress pants.',
    defaultSections: [
      {
        name: 'JACKET / BLAZER',
        fields: [
          { id: 'neck', label: 'Neck' },
          { id: 'shoulder', label: 'Shoulder' },
          { id: 'chest', label: 'Chest' },
          { id: 'waist', label: 'Waist / Midsection' },
          { id: 'hip', label: 'Hip' },
          { id: 'sleeve', label: 'Sleeve Length' },
          { id: 'bicep', label: 'Bicep' },
          { id: 'wrist', label: 'Wrist' },
          { id: 'jacketLength', label: 'Jacket Length' },
          { id: 'backWidth', label: 'Cross Back' },
        ]
      },
      {
        name: 'TROUSER',
        fields: [
          { id: 'waist', label: 'Waist' },
          { id: 'hipSeat', label: 'Hip/Seat' },
          { id: 'thigh', label: 'Thigh' },
          { id: 'knee', label: 'Knee' },
          { id: 'crotchRise', label: 'Crotch/Rise' },
          { id: 'trouserLength', label: 'Outseam Length' },
          { id: 'bottom', label: 'Cuff Opening' },
        ]
      }
    ]
  }
];

export function createDefaultGarmentSections(): GarmentSection[] {
  return [
    {
      id: 'sec-top',
      name: 'TOP',
      fields: [
        { id: 'neck', label: 'Neck', value: '' },
        { id: 'shoulder', label: 'Shoulder', value: '' },
        { id: 'chest', label: 'Chest', value: '' },
        { id: 'stomach', label: 'Stomach', value: '' },
        { id: 'hip', label: 'Hip', value: '' },
        { id: 'sleeve', label: 'Sleeve', value: '' },
        { id: 'bicep', label: 'Bicep', value: '' },
        { id: 'wrist', label: 'Wrist', value: '' },
        { id: 'topLength', label: 'Top Length', value: '' },
      ]
    },
    {
      id: 'sec-trouser',
      name: 'TROUSER',
      fields: [
        { id: 'waist', label: 'Waist', value: '' },
        { id: 'hipSeat', label: 'Hip/Seat', value: '' },
        { id: 'thigh', label: 'Thigh', value: '' },
        { id: 'knee', label: 'Knee', value: '' },
        { id: 'crotchRise', label: 'Crotch/Rise', value: '' },
        { id: 'trouserLength', label: 'Trouser Length', value: '' },
        { id: 'bottom', label: 'Bottom', value: '' },
      ]
    }
  ];
}

export const INITIAL_CUSTOMERS: Customer[] = [];

export const POPULAR_FABRICS = [
  'Super 160s Italian Cashmere Wool',
  'Pure Swiss Voile Cotton',
  'Irish Linen 100% Pure',
  'Original Atiku Fabric',
  'Holland & Sherry Midnight Velvet',
  'Royal Damask Jacquard',
  'Silk Dupioni & Satin',
  'English Wool Flannel',
  'Egyptian Giza Cotton',
  'Heavy Aso-Oke Weave',
  'Senator Stretch Wool'
];

export const POPULAR_COLORS = [
  { name: 'Onyx Black', hex: '#111111' },
  { name: 'Royal Emerald', hex: '#0B3C2D' },
  { name: 'Midnight Navy', hex: '#0D1B2A' },
  { name: 'Champagne Gold', hex: '#D4AF37' },
  { name: 'Imperial Ivory', hex: '#FDFBF7' },
  { name: 'Burgundy Wine', hex: '#4A0E17' },
  { name: 'Charcoal Slate', hex: '#2B2D42' },
  { name: 'Dusty Camel', hex: '#C19A6B' },
  { name: 'Rich Terracotta', hex: '#A44A3F' },
  { name: 'Sapphire Blue', hex: '#0F4C81' }
];
