import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { loadShifts, saveShifts } from '../lib/storage';
import type { Shift } from '../types';

const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';

interface ShiftForm {
  employeeName: string;
  role: string;
  shiftStart: string;
  shiftEnd: string;
  location: string;
}

const defaultForm: ShiftForm = {
  employeeName: '',
  role: '',
  shiftStart: '',
  shiftEnd: '',
  location: '',
};

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>(loadShifts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ShiftForm>(defaultForm);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeName.trim()) return;
    const updated = [{ id: Date.now(), ...form }, ...shifts];
    setShifts(updated);
    saveShifts(updated);
    setForm(defaultForm);
    setShowForm(false);
  }

  function handleDelete(id: number) {
    const updated = shifts.filter(s => s.id !== id);
    setShifts(updated);
    saveShifts(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {shifts.length} shift{shifts.length !== 1 ? 's' : ''} scheduled
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Shift
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Schedule Shift</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Employee Name *</label>
              <input name="employeeName" value={form.employeeName} onChange={handleChange} required placeholder="Full name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <input name="role" value={form.role} onChange={handleChange} placeholder="e.g. Security Officer" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Shift Start</label>
              <input type="datetime-local" name="shiftStart" value={form.shiftStart} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Shift End</label>
              <input type="datetime-local" name="shiftEnd" value={form.shiftEnd} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Main Entrance" className={inputCls} />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setForm(defaultForm); }} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Schedule</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[550px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Employee</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Role</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Shift Start</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Shift End</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Location</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {shifts.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">No shifts scheduled.</td></tr>
            )}
            {shifts.map(shift => (
              <tr key={shift.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{shift.employeeName}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{shift.role}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{shift.shiftStart}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{shift.shiftEnd}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{shift.location}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(shift.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
