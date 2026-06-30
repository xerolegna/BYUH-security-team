import {
  mockTasks,
  mockIncidents,
  mockCameras,
  mockWorkOrders,
  mockShifts,
} from '../data/mockData';
import type { Task, Incident, Camera, WorkOrder, Shift } from '../types';

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const KEYS = {
  tasks: 'byuh_tasks',
  incidents: 'byuh_incidents',
  cameras: 'byuh_cameras',
  workOrders: 'byuh_work_orders',
  shifts: 'byuh_shifts',
} as const;

export const loadTasks = () => load<Task>(KEYS.tasks, mockTasks);
export const saveTasks = (data: Task[]) => save(KEYS.tasks, data);

export const loadIncidents = () => load<Incident>(KEYS.incidents, mockIncidents);
export const saveIncidents = (data: Incident[]) => save(KEYS.incidents, data);

export const loadCameras = () => load<Camera>(KEYS.cameras, mockCameras);
export const saveCameras = (data: Camera[]) => save(KEYS.cameras, data);

export const loadWorkOrders = () => load<WorkOrder>(KEYS.workOrders, mockWorkOrders);
export const saveWorkOrders = (data: WorkOrder[]) => save(KEYS.workOrders, data);

export const loadShifts = () => load<Shift>(KEYS.shifts, mockShifts);
export const saveShifts = (data: Shift[]) => save(KEYS.shifts, data);
