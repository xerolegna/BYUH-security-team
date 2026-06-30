import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Badge from '../components/Badge';
import { loadIncidents, saveIncidents } from '../lib/storage';
import type { Incident, Severity, IncidentStatus } from '../types';

const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500';
const selectCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';

interface IncidentForm {
  title: string;
  location: string;
  severity: Severity;
  description: string;
  status: IncidentStatus;
  dateReported: string;
}

const defaultForm: IncidentForm = {
  title: '',
  location: '',
  severity: 'Medium',
  description: '',
  status: 'Open',
  dateReported: new Date().toISOString().split('T')[0],
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(loadIncidents);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<IncidentForm>(defaultForm);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value } as IncidentForm));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const updated = [{ id: Date.now(), ...form }, ...incidents];
    setIncidents(updated);
    saveIncidents(updated);
    setForm(defaultForm);
    setShowForm(false);
  }

  function handleDelete(id: number) {
    const updated = incidents.filter(i => i.id !== id);
    setIncidents(updated);
    saveIncidents(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {incidents.length} incident{incidents.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Report Incident
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">New Incident Report</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="Incident title" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Where did this occur?" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Describe the incident" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Severity</label>
              <select name="severity" value={form.severity} onChange={handleChange} className={selectCls}>
                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={selectCls}>
                <option>Open</option><option>Investigating</option><option>Resolved</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Date Reported</label>
              <input type="date" name="dateReported" value={form.dateReported} onChange={handleChange} className={inputCls} />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setForm(defaultForm); }} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Report</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Location</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Severity</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Date Reported</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {incidents.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">No incidents reported.</td></tr>
            )}
            {incidents.map(incident => (
              <tr key={incident.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 dark:text-gray-100">{incident.title}</p>
                  {incident.description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 max-w-xs truncate">{incident.description}</p>}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{incident.location || '—'}</td>
                <td className="px-4 py-3"><Badge value={incident.severity} /></td>
                <td className="px-4 py-3"><Badge value={incident.status} /></td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{incident.dateReported}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(incident.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
