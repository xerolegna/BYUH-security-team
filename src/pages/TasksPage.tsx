import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { fetchTasks, insertTask, updateTask, deleteTask } from '../lib/db';
import { supabase } from '../lib/supabase';
import type { Task, Priority, TaskStatus } from '../types';

const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500';
const selectCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';

interface TaskForm { title: string; description: string; priority: Priority; status: TaskStatus; assignedTo: string; dueDate: string; }

const defaultForm: TaskForm = { title: '', description: '', priority: 'Medium', status: 'To Do', assignedTo: '', dueDate: '' };

function TaskFormFields({ form, onChange }: { form: TaskForm; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>Title *</label>
        <input name="title" value={form.title} onChange={onChange} required placeholder="Task title" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Assigned To</label>
        <input name="assignedTo" value={form.assignedTo} onChange={onChange} placeholder="Name" className={inputCls} />
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Description</label>
        <textarea name="description" value={form.description} onChange={onChange} rows={2} placeholder="Brief description" className={inputCls} />
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
          <option>To Do</option><option>In Progress</option><option>Done</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Due Date</label>
        <input type="date" name="dueDate" value={form.dueDate} onChange={onChange} className={inputCls} />
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TaskForm>(defaultForm);
  const [editing, setEditing] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState<TaskForm>(defaultForm);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks().then(setTasks).finally(() => setLoading(false));
    const channel = supabase.channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchTasks().then(setTasks))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value } as TaskForm));
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value } as TaskForm));
  }

  function openEdit(task: Task) {
    setEditing(task);
    setEditForm({ title: task.title, description: task.description, priority: task.priority, status: task.status, assignedTo: task.assignedTo, dueDate: task.dueDate });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const newTask = await insertTask(form);
    setTasks(prev => [newTask, ...prev]);
    setForm(defaultForm);
    setShowForm(false);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const updated = await updateTask(editing.id, editForm);
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditing(null);
  }

  async function handleDelete() {
    if (pendingDelete === null) return;
    setTasks(prev => prev.filter(t => t.id !== pendingDelete));
    await deleteTask(pendingDelete);
    setPendingDelete(null);
  }

  return (
    <div className="space-y-4">
      {pendingDelete !== null && (
        <ConfirmDialog
          message="Are you sure you want to delete this task?"
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {editing && (
        <Modal title="Edit Task" onClose={() => setEditing(null)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <TaskFormFields form={editForm} onChange={handleEditChange} />
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{loading ? 'Loading…' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}</p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Add Task
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">New Task</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TaskFormFields form={form} onChange={handleChange} />
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setForm(defaultForm); }} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Task</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Priority</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Assigned To</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Due Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">Loading…</td></tr>}
            {!loading && tasks.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No tasks yet. Click "Add Task" to get started.</td></tr>}
            {tasks.map(task => (
              <tr key={task.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 dark:text-gray-100">{task.title}</p>
                  {task.description && <p className="text-xs text-gray-400 mt-0.5">{task.description}</p>}
                </td>
                <td className="px-4 py-3"><Badge value={task.priority} /></td>
                <td className="px-4 py-3"><Badge value={task.status} /></td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{task.assignedTo || '—'}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{task.dueDate || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(task)} className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => setPendingDelete(task.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
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
