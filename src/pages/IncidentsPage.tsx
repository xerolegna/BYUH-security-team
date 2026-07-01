import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { fetchIncidents, insertIncident, updateIncident, deleteIncident } from '../lib/db';
import { supabase } from '../lib/supabase';
import type { Incident, Severity, IncidentStatus } from '../types';

const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500';
const selectCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';

interface IncidentForm { title: string; location: string; severity: Severity; description: string; status: IncidentStatus; dateReported: string; }

const defaultForm: IncidentForm = { title: '', location: '', severity: 'Medium', description: '', status: 'Open', dateReported: new Date().toISOString().split('T')[0] };

function IncidentFormFields({ form, onChange }: { form: IncidentForm; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>Title *</label>
        <input name="title" value={form.title} onChange={onChange} required placeholder="Incident title" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Location</label>
        <input name="location" value={form.location} onChange={onChange} placeholder="Where did this occur?" className={inputCls} />
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Description</label>
        <textarea name="description" value={form.description} onChange={onChange} rows={2} placeholder="Describe the incident" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Severity</label>
        <select name="severity" value={form.severity} onChange={onChange} className={selectCls}>
          <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Status</label>
        <select name="status" value={form.status} onChange={onChange} className={selectCls}>
          <option>Open</option><option>Investigating</option><option>Resolved</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Date Reported</label>
        <input type="date" name="dateReported" value={form.dateReported} onChange={onChange} className={inputCls} />
      </div>
    </div>
  );
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<IncidentForm>(defaultForm);
  const [editing, setEditing] = useState<Incident | null>(null);
  const [editForm, setEditForm] = useState<IncidentForm>(defaultForm);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchIncidents().then(setIncidents).finally(() => setLoading(false));
    const channel = supabase.channel('incidents-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => fetchIncidents().then(setIncidents))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value } as IncidentForm));
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value } as IncidentForm));
  }

  function openEdit(incident: Incident) {
    setEditing(incident);
    setEditForm({ title: incident.title, location: incident.location, severity: incident.severity, description: incident.description, status: incident.status, dateReported: incident.dateReported });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const newIncident = await insertIncident(form);
    setIncidents(prev => [newIncident, ...prev]);
    setForm(defaultForm);
    setShowForm(false);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const updated = await updateIncident(editing.id, editForm);
    setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i));
    setEditing(null);
  }

  async function handleDelete() {
    if (pendingDelete === null) return;
    setIncidents(prev => prev.filter(i => i.id !== pendingDelete));
    await deleteIncident(pendingDelete);
    setPendingDelete(null);
  }

  return (
    <div className="space-y-4">
      {pendingDelete !== null && (
        <ConfirmDialog
          message="Are you sure you want to delete this incident?"
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {editing && (
        <Modal title="Edit Incident" onClose={() => setEditing(null)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <IncidentFormFields form={editForm} onChange={handleEditChange} />
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{loading ? 'Loading…' : `${incidents.length} incident${incidents.length !== 1 ? 's' : ''}`}</p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Report Incident
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">New Incident Report</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <IncidentFormFields form={form} onChange={handleChange} />
            <div className="flex gap-3 justify-end">
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
            {loading && <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">Loading…</td></tr>}
            {!loading && incidents.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No incidents reported.</td></tr>}
            {incidents.map(incident => (
              <tr key={incident.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 dark:text-gray-100">{incident.title}</p>
                  {incident.description && <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{incident.description}</p>}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{incident.location || '—'}</td>
                <td className="px-4 py-3"><Badge value={incident.severity} /></td>
                <td className="px-4 py-3"><Badge value={incident.status} /></td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{incident.dateReported}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(incident)} className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => setPendingDelete(incident.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
