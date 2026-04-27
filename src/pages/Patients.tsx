import { useMemo } from 'react';
import { applyFilters, getDepartments, usePatientStore } from '@/store/patientStore';
import { PatientCard } from '@/components/patients/PatientCard';
import { PatientRow } from '@/components/patients/PatientRow';
import { ViewToggle } from '@/components/patients/ViewToggle';
import { PatientDetailDrawer } from '@/components/patients/PatientDetailDrawer';
import { SearchIcon } from '@/components/common/Icon';
import { Button } from '@/components/common/Button';
import styles from './Patients.module.css';
import type { PatientStatus, RiskLevel } from '@/types';

export function PatientsPage() {
  const patients = usePatientStore((s) => s.patients);
  const viewMode = usePatientStore((s) => s.viewMode);
  const setViewMode = usePatientStore((s) => s.setViewMode);
  const filters = usePatientStore((s) => s.filters);
  const setSearch = usePatientStore((s) => s.setSearch);
  const setStatus = usePatientStore((s) => s.setStatus);
  const setRisk = usePatientStore((s) => s.setRisk);
  const setDepartment = usePatientStore((s) => s.setDepartment);
  const resetFilters = usePatientStore((s) => s.resetFilters);
  const select = usePatientStore((s) => s.select);
  const selectedId = usePatientStore((s) => s.selectedId);

  const filtered = useMemo(() => applyFilters(patients, filters), [patients, filters]);
  const departments = useMemo(() => getDepartments(patients), [patients]);

  const selected = useMemo(
    () => filtered.find((p) => p.id === selectedId) ?? null,
    [filtered, selectedId],
  );

  const filtersDirty =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.risk !== 'all' ||
    filters.department !== 'all';

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">Patients</h1>
          <p className="page__subtitle">
            Browse and filter your patient panel. Toggle between grid and list views.
          </p>
        </div>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </header>

      <section className={`card card--padded ${styles.toolbar}`}>
        <div className={styles.searchWrap}>
          <SearchIcon size={16} />
          <input
            className={styles.search}
            type="search"
            placeholder="Search by name, ID, condition, physician…"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search patients"
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.select}
            value={filters.status}
            onChange={(e) => setStatus(e.target.value as 'all' | PatientStatus)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="admitted">Admitted</option>
            <option value="follow-up">Follow-up</option>
            <option value="discharged">Discharged</option>
          </select>

          <select
            className={styles.select}
            value={filters.risk}
            onChange={(e) => setRisk(e.target.value as 'all' | RiskLevel)}
            aria-label="Filter by risk"
          >
            <option value="all">All risk levels</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            className={styles.select}
            value={filters.department}
            onChange={(e) => setDepartment(e.target.value as 'all' | string)}
            aria-label="Filter by department"
          >
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {filtersDirty && (
            <Button variant="subtle" small onClick={resetFilters}>
              Reset
            </Button>
          )}
        </div>
      </section>

      <section className={styles.resultMeta}>
        <span>
          Showing <strong>{filtered.length}</strong>{' '}
          {filtered.length === 1 ? 'patient' : 'patients'}
        </span>
      </section>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <strong>No patients match your filters</strong>
          <span>Try clearing search or relaxing the filters above.</span>
          {filtersDirty && (
            <Button small variant="ghost" onClick={resetFilters}>
              Reset filters
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <section className={styles.grid}>
          {filtered.map((p) => (
            <PatientCard key={p.id} patient={p} onSelect={select} />
          ))}
        </section>
      ) : (
        <section className="card">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Condition</th>
                  <th>Physician</th>
                  <th>Last visit</th>
                  <th>Next visit</th>
                  <th>Risk</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <PatientRow key={p.id} patient={p} onSelect={select} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <PatientDetailDrawer patient={selected} onClose={() => select(null)} />
    </div>
  );
}
