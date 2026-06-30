interface StatCardProps {
  title: string;
  value: number | string;
  color: 'blue' | 'red' | 'green' | 'purple' | 'orange';
}

const borders: Record<string, string> = {
  blue: 'border-blue-500',
  red: 'border-red-500',
  green: 'border-green-500',
  purple: 'border-purple-500',
  orange: 'border-orange-500',
};

const values: Record<string, string> = {
  blue: 'text-blue-600 dark:text-blue-400',
  red: 'text-red-600 dark:text-red-400',
  green: 'text-green-600 dark:text-green-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
};

export default function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border-l-4 p-5 shadow-sm ${borders[color]}`}>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${values[color]}`}>{value}</p>
    </div>
  );
}
