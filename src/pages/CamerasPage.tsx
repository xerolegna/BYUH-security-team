import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Badge from '../components/Badge';
import { mockCameras } from '../data/mockData';
import type { Camera, CameraStatus } from '../types';

const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500';
const selectCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';

interface CameraForm {
  name: string;
  location: string;
  status: CameraStatus;
  lastChecked: string;
}

const defaultForm: CameraForm = {
  name: '',
  location: '',
  status: 'Online',
  lastChecked: new Date().toISOString().split('T')[0],
};

export default function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>(mockCameras);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CameraForm>(defaultForm);

  const online = cameras.filter(c => c.status === 'Online').length;
  const offline = cameras.filter(c => c.status === 'Offline').length;
  const maintenance = cameras.filter(c => c.status === 'Maintenance').length;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value } as CameraForm));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCameras(prev => [{ id: Date.now(), ...form }, ...prev]);
    setForm(defaultForm);
    setShowForm(false);
  }

  function handleDelete(id: number) {
    setCameras(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">{online} Online</span>
        <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium">{offline} Offline</span>
        <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">{maintenance} Maintenance</span>
        <div className="flex-1" />
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Camera
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Register Camera</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Camera Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. CAM-07" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. South Parking Lot" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={selectCls}>
                <option>Online</option><option>Offline</option><option>Maintenance</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Last Checked</label>
              <input type="date" name="lastChecked" value={form.lastChecked} onChange={handleChange} className={inputCls} />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setForm(defaultForm); }} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Register</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Camera</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Location</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Last Checked</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {cameras.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">No cameras registered.</td></tr>
            )}
            {cameras.map(cam => (
              <tr key={cam.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{cam.name}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{cam.location}</td>
                <td className="px-4 py-3"><Badge value={cam.status} /></td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{cam.lastChecked}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(cam.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
