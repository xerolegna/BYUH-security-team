import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Badge from '../components/Badge';
import { loadTasks, saveTasks } from '../lib/storage';
import type { Task, Priority, TaskStatus } from '../types';

const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500';
const selectCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';

interface TaskForm {
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  assignedTo: string;
  dueDate: string;
}

const defaultForm: TaskForm = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'To Do',
  assignedTo: '',
  dueDate: '',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TaskForm>(defaultForm);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value } as TaskForm));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const updated = [{ id: Date.now(), ...form }, ...tasks];
    setTasks(updated);
    saveTasks(updated);
    setForm(defaultForm);
    setShowForm(false);
  }

  function handleDelete(id: number) {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">New Task</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="Task title" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Assigned To</label>
              <input name="assignedTo" value={form.assignedTo} onChange={handleChange} placeholder="Name" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Brief description" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className={selectCls}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={selectCls}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className={inputCls} />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
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
            {tasks.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">No tasks yet. Click "Add Task" to get started.</td></tr>
            )}
            {tasks.map(task => (
              <tr key={task.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 dark:text-gray-100">{task.title}</p>
                  {task.description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{task.description}</p>}
                </td>
                <td className="px-4 py-3"><Badge value={task.priority} /></td>
                <td className="px-4 py-3"><Badge value={task.status} /></td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{task.assignedTo || '—'}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{task.dueDate || '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(task.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
