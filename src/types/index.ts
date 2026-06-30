export type Priority = 'Low' | 'Medium' | 'High';
export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type IncidentStatus = 'Open' | 'Investigating' | 'Resolved';
export type CameraStatus = 'Online' | 'Offline' | 'Maintenance';
export type WorkOrderType = 'Repair' | 'Install' | 'Inspection';
export type WorkOrderStatus = 'Open' | 'In Progress' | 'Completed';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  assignedTo: string;
  dueDate: string;
}

export interface Incident {
  id: number;
  title: string;
  location: string;
  severity: Severity;
  description: string;
  status: IncidentStatus;
  dateReported: string;
}

export interface Camera {
  id: number;
  name: string;
  location: string;
  status: CameraStatus;
  lastChecked: string;
}

export interface WorkOrder {
  id: number;
  title: string;
  type: WorkOrderType;
  priority: Priority;
  status: WorkOrderStatus;
  assignedTo: string;
}

export interface Shift {
  id: number;
  employeeName: string;
  role: string;
  shiftStart: string;
  shiftEnd: string;
  location: string;
}
