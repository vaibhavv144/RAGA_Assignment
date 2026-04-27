export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export type Gender = 'male' | 'female' | 'other';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export type PatientStatus = 'active' | 'discharged' | 'follow-up' | 'admitted';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  email: string;
  phone: string;
  bloodGroup: string;
  primaryCondition: string;
  attendingPhysician: string;
  department: string;
  lastVisit: string; // ISO date
  nextAppointment: string | null; // ISO date or null
  status: PatientStatus;
  riskLevel: RiskLevel;
  avatarColor: string;
}

export type ViewMode = 'grid' | 'list';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  level: 'info' | 'success' | 'warning' | 'critical';
}
