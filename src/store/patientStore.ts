import { create } from 'zustand';
import { patients as seed } from '@/data/patients';
import type { Patient, PatientStatus, RiskLevel, ViewMode } from '@/types';

interface PatientFilters {
  search: string;
  status: 'all' | PatientStatus;
  risk: 'all' | RiskLevel;
  department: 'all' | string;
}

interface PatientState {
  patients: Patient[];
  viewMode: ViewMode;
  filters: PatientFilters;
  selectedId: string | null;
  setViewMode: (m: ViewMode) => void;
  toggleViewMode: () => void;
  setSearch: (q: string) => void;
  setStatus: (s: PatientFilters['status']) => void;
  setRisk: (r: PatientFilters['risk']) => void;
  setDepartment: (d: PatientFilters['department']) => void;
  resetFilters: () => void;
  select: (id: string | null) => void;
}

const VIEW_KEY = 'healthplus.viewMode';

function readView(): ViewMode {
  const stored = typeof localStorage !== 'undefined' && localStorage.getItem(VIEW_KEY);
  return stored === 'list' ? 'list' : 'grid';
}

const defaultFilters: PatientFilters = {
  search: '',
  status: 'all',
  risk: 'all',
  department: 'all',
};

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: seed,
  viewMode: readView(),
  filters: { ...defaultFilters },
  selectedId: null,

  setViewMode: (m) => {
    localStorage.setItem(VIEW_KEY, m);
    set({ viewMode: m });
  },
  toggleViewMode: () => {
    const next = get().viewMode === 'grid' ? 'list' : 'grid';
    localStorage.setItem(VIEW_KEY, next);
    set({ viewMode: next });
  },
  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
  setStatus: (status) => set((s) => ({ filters: { ...s.filters, status } })),
  setRisk: (risk) => set((s) => ({ filters: { ...s.filters, risk } })),
  setDepartment: (department) => set((s) => ({ filters: { ...s.filters, department } })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
  select: (id) => set({ selectedId: id }),
}));

export function applyFilters(patients: Patient[], filters: PatientFilters): Patient[] {
  const q = filters.search.trim().toLowerCase();
  return patients.filter((p) => {
    if (filters.status !== 'all' && p.status !== filters.status) return false;
    if (filters.risk !== 'all' && p.riskLevel !== filters.risk) return false;
    if (filters.department !== 'all' && p.department !== filters.department) return false;
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.primaryCondition.toLowerCase().includes(q) ||
      p.attendingPhysician.toLowerCase().includes(q)
    );
  });
}

export function getDepartments(patients: Patient[]): string[] {
  return Array.from(new Set(patients.map((p) => p.department))).sort();
}
