import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { fetchWorkOrders, insertWorkOrder, updateWorkOrder, deleteWorkOrder } from '../lib/db';
import { supabase } from '../lib/supabase';
import type { WorkOrder, WorkOrderType, WorkOrderStatus, Priority } from '../types';

const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500';
const selectCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';

interface WorkOrderForm { title: string; type: WorkOrderType; priority: Priority; status: WorkOrderStatus; assignedTo: string; }

const defaultForm: WorkOrderForm = { title: '', type: 'Repair', priority: 'Medium', status: 'Open', assignedTo: '' };

function WorkOrderFormFields({ form, onChange }: { form: WorkOrderForm; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className={labelCls}>Title *</label>
        <input name="title" value={form.title} onChange={onChange} required placeholder="Describe the work" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Type</label>
        <select name="type" value={form.type} onChange={onChange} className={selectCls}>
          <option>Repair</option><option>Install</option><option>Inspection</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Priority</label>
        <select name="priority" value={form.priority} onChange={onChange} className={selectCls}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Status</label>
        <select name="status" value={form.status} onChange={onChange} className={selectCls}>
          <option>Open</option><option>In Progress</option><option>Completed</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Assigned To</label>
        <input name="assignedTo" value={form.assignedTo} onChange={onChange} placeholder="Name" className={inputCls} />
      </div>
    </div>
  );
}

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<WorkOrderForm>(defaultForm);
  const [editing, setEditing] = useState<WorkOrder | null>(null);
  const [editForm, setEditForm] = useState<WorkOrderForm>(defaultForm);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchWorkOrders().then(setOrders).finally(() => setLoading(false));
    const channel = supabase.channel('work-orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'work_orders' }, () => fetchWorkOrders().then(setOrders))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value } as WorkOrderForm));
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value } as WorkOrderForm));
  }

  function openEdit(order: WorkOrder) {
    setEditing(order);
    setEditForm({ title: order.title, type: order.type, priority: order.priority, status: order.status, assignedTo: order.assignedTo });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const newOrder = await insertWorkOrder(form);
    setOrders(prev => [newOrder, ...prev]);
    setForm(defaultForm);
    setShowForm(false);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const updated = await updateWorkOrder(editing.id, editForm);
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    setEditing(null);
  }

  async function handleDelete() {
    if (pendingDelete === null) return;
    setOrders(prev => prev.filter(o => o.id !== pendingDelete));
    await deleteWorkOrder(pendingDelete);
    setPendingDelete(null);
  }

  return (
    <div className="space-y-4">
      {pendingDelete !== null && (
        <ConfirmDialog
          message="Are you sure you want to delete this work order?"
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {editing && (
        <Modal title="Edit Work Order" onClose={() => setEditing(null)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <WorkOrderFormFields form={editForm} onChange={handleEditChange} />
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{loading ? 'Loading…' : `${orders.length} work order${orders.length !== 1 ? 's' : ''}`}</p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
          <Plus size={16} /> New Work Order
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">New Work Order</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <WorkOrderFormFields form={form} onChange={handleChange} />
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setForm(defaultForm); }} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Order</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[550px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Priority</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Assigned To</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">Loading…</td></tr>}
            {!loading && orders.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No work orders yet.</td></tr>}
            {orders.map(order => (
              <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{order.title}</td>
                <td className="px-4 py-3"><Badge value={order.type} /></td>
                <td className="px-4 py-3"><Badge value={order.priority} /></td>
                <td className="px-4 py-3"><Badge value={order.status} /></td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{order.assignedTo || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(order)} className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => setPendingDelete(order.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
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
