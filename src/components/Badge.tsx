interface BadgeProps {
  value: string;
}

const styles: Record<string, string> = {
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  'To Do': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  Done: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Open: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  Investigating: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  Resolved: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Online: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Offline: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  Maintenance: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Repair: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  Install: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  Inspection: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
};

export default function Badge({ value }: BadgeProps) {
  const cls = styles[value] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {value}
    </span>
  );
}
