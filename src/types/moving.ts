export type FormulaId = 'economique' | 'classique' | 'major' | 'privilege';

export type HousingType = 'Appartement' | 'Maison' | 'Bureau / Local' | 'Garde-meuble';

export type MovingStatus =
  | 'demande_recue'
  | 'demande_acceptee'
  | 'rdv_confirme'
  | 'chauffeur_assigne'
  | 'chauffeur_en_route'
  | 'chauffeur_arrive'
  | 'chargement_en_cours'
  | 'chargement_termine'
  | 'en_route_destination'
  | 'arrive_destination'
  | 'dechargement_en_cours'
  | 'demenagement_termine'
  | 'demande_refusee';

export interface AddressInfo {
  address: string;
  city: string;
  postalCode: string;
  housingType: HousingType;
  floor: number;
  hasElevator: boolean;
  details?: string;
}

export interface ClientInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface Appointment {
  date: string;
  time: string;
  notes?: string;
}

export interface StatusHistoryItem {
  status: MovingStatus;
  timestamp: string;
  updatedBy: 'client' | 'admin' | 'chauffeur' | 'system';
  note?: string;
}

export interface MovingRequest {
  id: string; // DEM-2026-00125
  createdAt: string;
  client: ClientInfo;
  departure: AddressInfo;
  arrival: AddressInfo;
  formulaId: FormulaId;
  estimatedVolumeM3: number;
  preferredDate: string;
  appointment?: Appointment;
  status: MovingStatus;
  assignedDriverId?: string;
  statusHistory: StatusHistoryItem[];
  driverNotes?: string;
  signature?: string;
  estimatedPrice: number;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleType: string;
  vehicleCapacityM3: number;
  availability: 'disponible' | 'en_mission' | 'conge';
  activeMissionRef?: string;
}

export interface EmailNotification {
  id: string;
  timestamp: string;
  to: string;
  recipientType: 'client' | 'proprietaire' | 'chauffeur';
  subject: string;
  previewText: string;
  contentHtml: string;
  relatedRequestId: string;
  isRead: boolean;
}

export interface FormulaFeature {
  id: string;
  label: string;
}

export interface FormulaPackage {
  id: FormulaId;
  name: string;
  subtitle: string;
  basePrice: number;
  stars: number;
  clientShare: number; // e.g. 40
  companyShare: number; // e.g. 60
  accentColor: string;
  description: string;
  features: Record<string, 'inclus' | 'option'>;
}
