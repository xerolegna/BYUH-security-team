import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import { mockTasks, mockIncidents, mockCameras, mockWorkOrders, mockShifts } from '../data/mockData';

export default function DashboardPage() {
  const openIncidents = mockIncidents.filter(i => i.status !== 'Resolved').length;
  const activeCameras = mockCameras.filter(c => c.status === 'Online').length;
  const openWorkOrders = mockWorkOrders.filter(w => w.status !== 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard title="Total Tasks" value={mockTasks.length} color="blue" />
        <StatCard title="Open Incidents" value={openIncidents} color="red" />
        <StatCard title="Active Cameras" value={activeCameras} color="green" />
        <StatCard title="Work Orders" value={openWorkOrders} color="purple" />
        <StatCard title="Upcoming Shifts" value={mockShifts.length} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Incidents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Recent Incidents
          </h3>
          <div className="space-y-1">
            {mockIncidents.map(incident => (
              <div
                key={incident.id}
                className="flex items-start justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                    {incident.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {incident.location} &mdash; {incident.dateReported}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 shrink-0">
                  <Badge value={incident.severity} />
                  <Badge value={incident.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Task Overview
          </h3>
          <div className="space-y-1">
            {mockTasks.map(task => (
              <div
                key={task.id}
                className="flex items-start justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {task.assignedTo} &mdash; Due {task.dueDate}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 shrink-0">
                  <Badge value={task.priority} />
                  <Badge value={task.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Camera Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Camera Status
          </h3>
          <div className="space-y-1">
            {mockCameras.map(cam => (
              <div
                key={cam.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{cam.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{cam.location}</p>
                </div>
                <Badge value={cam.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Shifts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Upcoming Shifts
          </h3>
          <div className="space-y-1">
            {mockShifts.map(shift => (
              <div
                key={shift.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {shift.employeeName}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {shift.role} &mdash; {shift.location}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {shift.shiftStart}<br />→ {shift.shiftEnd}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
