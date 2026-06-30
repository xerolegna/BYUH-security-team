import { supabase } from './supabase';
import type { Task, Incident, Camera, WorkOrder, Shift } from '../types';

// ── Tasks ──────────────────────────────────────────────────────────────────

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => ({
    id: r.id,
    title: r.title,
    description: r.description ?? '',
    priority: r.priority,
    status: r.status,
    assignedTo: r.assigned_to ?? '',
    dueDate: r.due_date ?? '',
  }));
}

export async function insertTask(task: Omit<Task, 'id'>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assigned_to: task.assignedTo,
      due_date: task.dueDate,
    })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    description: data.description ?? '',
    priority: data.priority,
    status: data.status,
    assignedTo: data.assigned_to ?? '',
    dueDate: data.due_date ?? '',
  };
}

export async function updateTask(id: number, task: Omit<Task, 'id'>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ title: task.title, description: task.description, priority: task.priority, status: task.status, assigned_to: task.assignedTo, due_date: task.dueDate })
    .eq('id', id).select().single();
  if (error) throw error;
  return { id: data.id, title: data.title, description: data.description ?? '', priority: data.priority, status: data.status, assignedTo: data.assigned_to ?? '', dueDate: data.due_date ?? '' };
}

export async function deleteTask(id: number): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}

// ── Incidents ─────────────────────────────────────────────────────────────

export async function fetchIncidents(): Promise<Incident[]> {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => ({
    id: r.id,
    title: r.title,
    location: r.location ?? '',
    severity: r.severity,
    description: r.description ?? '',
    status: r.status,
    dateReported: r.date_reported ?? '',
  }));
}

export async function insertIncident(incident: Omit<Incident, 'id'>): Promise<Incident> {
  const { data, error } = await supabase
    .from('incidents')
    .insert({
      title: incident.title,
      location: incident.location,
      severity: incident.severity,
      description: incident.description,
      status: incident.status,
      date_reported: incident.dateReported,
    })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    location: data.location ?? '',
    severity: data.severity,
    description: data.description ?? '',
    status: data.status,
    dateReported: data.date_reported ?? '',
  };
}

export async function updateIncident(id: number, incident: Omit<Incident, 'id'>): Promise<Incident> {
  const { data, error } = await supabase
    .from('incidents')
    .update({ title: incident.title, location: incident.location, severity: incident.severity, description: incident.description, status: incident.status, date_reported: incident.dateReported })
    .eq('id', id).select().single();
  if (error) throw error;
  return { id: data.id, title: data.title, location: data.location ?? '', severity: data.severity, description: data.description ?? '', status: data.status, dateReported: data.date_reported ?? '' };
}

export async function deleteIncident(id: number): Promise<void> {
  const { error } = await supabase.from('incidents').delete().eq('id', id);
  if (error) throw error;
}

// ── Cameras ───────────────────────────────────────────────────────────────

export async function fetchCameras(): Promise<Camera[]> {
  const { data, error } = await supabase
    .from('cameras')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => ({
    id: r.id,
    name: r.name,
    location: r.location ?? '',
    status: r.status,
    lastChecked: r.last_checked ?? '',
  }));
}

export async function insertCamera(camera: Omit<Camera, 'id'>): Promise<Camera> {
  const { data, error } = await supabase
    .from('cameras')
    .insert({
      name: camera.name,
      location: camera.location,
      status: camera.status,
      last_checked: camera.lastChecked,
    })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    location: data.location ?? '',
    status: data.status,
    lastChecked: data.last_checked ?? '',
  };
}

export async function updateCamera(id: number, camera: Omit<Camera, 'id'>): Promise<Camera> {
  const { data, error } = await supabase
    .from('cameras')
    .update({ name: camera.name, location: camera.location, status: camera.status, last_checked: camera.lastChecked })
    .eq('id', id).select().single();
  if (error) throw error;
  return { id: data.id, name: data.name, location: data.location ?? '', status: data.status, lastChecked: data.last_checked ?? '' };
}

export async function deleteCamera(id: number): Promise<void> {
  const { error } = await supabase.from('cameras').delete().eq('id', id);
  if (error) throw error;
}

// ── Work Orders ───────────────────────────────────────────────────────────

export async function fetchWorkOrders(): Promise<WorkOrder[]> {
  const { data, error } = await supabase
    .from('work_orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => ({
    id: r.id,
    title: r.title,
    type: r.type,
    priority: r.priority,
    status: r.status,
    assignedTo: r.assigned_to ?? '',
  }));
}

export async function insertWorkOrder(order: Omit<WorkOrder, 'id'>): Promise<WorkOrder> {
  const { data, error } = await supabase
    .from('work_orders')
    .insert({
      title: order.title,
      type: order.type,
      priority: order.priority,
      status: order.status,
      assigned_to: order.assignedTo,
    })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    type: data.type,
    priority: data.priority,
    status: data.status,
    assignedTo: data.assigned_to ?? '',
  };
}

export async function updateWorkOrder(id: number, order: Omit<WorkOrder, 'id'>): Promise<WorkOrder> {
  const { data, error } = await supabase
    .from('work_orders')
    .update({ title: order.title, type: order.type, priority: order.priority, status: order.status, assigned_to: order.assignedTo })
    .eq('id', id).select().single();
  if (error) throw error;
  return { id: data.id, title: data.title, type: data.type, priority: data.priority, status: data.status, assignedTo: data.assigned_to ?? '' };
}

export async function deleteWorkOrder(id: number): Promise<void> {
  const { error } = await supabase.from('work_orders').delete().eq('id', id);
  if (error) throw error;
}

// ── Shifts ────────────────────────────────────────────────────────────────

export async function fetchShifts(): Promise<Shift[]> {
  const { data, error } = await supabase
    .from('shifts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => ({
    id: r.id,
    employeeName: r.employee_name,
    role: r.role ?? '',
    shiftStart: r.shift_start ?? '',
    shiftEnd: r.shift_end ?? '',
    location: r.location ?? '',
  }));
}

export async function insertShift(shift: Omit<Shift, 'id'>): Promise<Shift> {
  const { data, error } = await supabase
    .from('shifts')
    .insert({
      employee_name: shift.employeeName,
      role: shift.role,
      shift_start: shift.shiftStart,
      shift_end: shift.shiftEnd,
      location: shift.location,
    })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    employeeName: data.employee_name,
    role: data.role ?? '',
    shiftStart: data.shift_start ?? '',
    shiftEnd: data.shift_end ?? '',
    location: data.location ?? '',
  };
}

export async function updateShift(id: number, shift: Omit<Shift, 'id'>): Promise<Shift> {
  const { data, error } = await supabase
    .from('shifts')
    .update({ employee_name: shift.employeeName, role: shift.role, shift_start: shift.shiftStart, shift_end: shift.shiftEnd, location: shift.location })
    .eq('id', id).select().single();
  if (error) throw error;
  return { id: data.id, employeeName: data.employee_name, role: data.role ?? '', shiftStart: data.shift_start ?? '', shiftEnd: data.shift_end ?? '', location: data.location ?? '' };
}

export async function deleteShift(id: number): Promise<void> {
  const { error } = await supabase.from('shifts').delete().eq('id', id);
  if (error) throw error;
}
