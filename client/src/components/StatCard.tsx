type StatCardProps = {
  priority: '1' | '2' | '3';
  count: number;
  icon: string;
  title: string;
}

export default function StatCard({ priority, count, icon, title }: StatCardProps) {
  const priorityColors = {
    '1': 'text-[hsl(var(--priority1))] bg-[hsl(var(--priority1))]',
    '2': 'text-[hsl(var(--priority2))] bg-[hsl(var(--priority2))]',
    '3': 'text-[hsl(var(--priority3))] bg-[hsl(var(--priority3))]',
  };

  return (
    <div className="bg-surface rounded-lg shadow p-4 flex items-center">
      <div className={`mr-4 ${priorityColors[priority].split(' ')[1]}/10 p-3 rounded-full`}>
        <span className={`material-icons ${priorityColors[priority].split(' ')[0]}`}>
          {icon}
        </span>
      </div>
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-medium">{count}</p>
      </div>
    </div>
  );
}
