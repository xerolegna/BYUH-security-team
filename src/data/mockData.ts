import type { Task, Incident, Camera, WorkOrder, Shift } from '../types';

export const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Update antivirus definitions',
    description: 'Push latest AV updates to all workstations',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Marcus Johnson',
    dueDate: '2025-07-05',
  },
  {
    id: 2,
    title: 'Replace printer toner – B wing',
    description: 'HP LaserJet M404dn is low on toner',
    priority: 'Low',
    status: 'To Do',
    assignedTo: 'Sara Patel',
    dueDate: '2025-07-08',
  },
  {
    id: 3,
    title: 'Network switch audit',
    description: 'Verify all switch configs match baseline',
    priority: 'Medium',
    status: 'To Do',
    assignedTo: 'Marcus Johnson',
    dueDate: '2025-07-10',
  },
  {
    id: 4,
    title: 'Enforce new password policy via GPO',
    description: 'Roll out 14-character minimum policy to all domain users',
    priority: 'High',
    status: 'Done',
    assignedTo: 'Alex Rivera',
    dueDate: '2025-06-30',
  },
];

export const mockIncidents: Incident[] = [
  {
    id: 1,
    title: 'Unauthorized access attempt – Server Room',
    location: 'Building A – Server Room',
    severity: 'Critical',
    description: 'Badge reader logged 3 failed access attempts at 2:14 AM.',
    status: 'Investigating',
    dateReported: '2025-07-01',
  },
  {
    id: 2,
    title: 'Phishing email campaign detected',
    location: 'Corporate Email',
    severity: 'High',
    description: 'Multiple users received spoofed HR emails with malicious links.',
    status: 'Open',
    dateReported: '2025-07-02',
  },
  {
    id: 3,
    title: 'Parking lot camera offline',
    location: 'North Parking Lot',
    severity: 'Medium',
    description: 'Camera CAM-03 lost feed — possible power issue.',
    status: 'Open',
    dateReported: '2025-07-03',
  },
  {
    id: 4,
    title: 'Visitor badge system glitch',
    location: 'Main Lobby',
    severity: 'Low',
    description: 'Visitor badge printer intermittently failing.',
    status: 'Resolved',
    dateReported: '2025-06-28',
  },
];

export const mockCameras: Camera[] = [
  { id: 1, name: 'CAM-01', location: 'Main Entrance', status: 'Online', lastChecked: '2025-07-03' },
  { id: 2, name: 'CAM-02', location: 'Server Room', status: 'Online', lastChecked: '2025-07-03' },
  { id: 3, name: 'CAM-03', location: 'Parking Lot – North', status: 'Offline', lastChecked: '2025-07-01' },
  { id: 4, name: 'CAM-04', location: 'Break Room', status: 'Online', lastChecked: '2025-07-03' },
  { id: 5, name: 'CAM-05', location: 'Loading Dock', status: 'Maintenance', lastChecked: '2025-06-30' },
  { id: 6, name: 'CAM-06', location: 'Executive Floor', status: 'Online', lastChecked: '2025-07-03' },
];

export const mockWorkOrders: WorkOrder[] = [
  {
    id: 1,
    title: 'Replace UPS battery – Rack 3',
    type: 'Repair',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Marcus Johnson',
  },
  {
    id: 2,
    title: 'Install access panel – B wing door',
    type: 'Install',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Sara Patel',
  },
  {
    id: 3,
    title: 'Quarterly fire suppression inspection',
    type: 'Inspection',
    priority: 'High',
    status: 'Open',
    assignedTo: 'Alex Rivera',
  },
  {
    id: 4,
    title: 'Repair lobby intercom unit',
    type: 'Repair',
    priority: 'Low',
    status: 'Completed',
    assignedTo: 'Marcus Johnson',
  },
];

export const mockShifts: Shift[] = [
  {
    id: 1,
    employeeName: 'Jordan Williams',
    role: 'Security Officer',
    shiftStart: '2025-07-04 06:00',
    shiftEnd: '2025-07-04 14:00',
    location: 'Main Entrance',
  },
  {
    id: 2,
    employeeName: 'Casey Brown',
    role: 'IT Technician',
    shiftStart: '2025-07-04 08:00',
    shiftEnd: '2025-07-04 17:00',
    location: 'IT Help Desk',
  },
  {
    id: 3,
    employeeName: 'Morgan Lee',
    role: 'Security Officer',
    shiftStart: '2025-07-04 14:00',
    shiftEnd: '2025-07-04 22:00',
    location: 'Parking Lot',
  },
  {
    id: 4,
    employeeName: 'Taylor Kim',
    role: 'Night Security',
    shiftStart: '2025-07-04 22:00',
    shiftEnd: '2025-07-05 06:00',
    location: 'All Areas',
  },
  {
    id: 5,
    employeeName: 'Jordan Williams',
    role: 'Security Officer',
    shiftStart: '2025-07-05 06:00',
    shiftEnd: '2025-07-05 14:00',
    location: 'Main Entrance',
  },
];
