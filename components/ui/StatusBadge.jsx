'use client';

import { Badge } from '@/components/ui/badge';

export default function StatusBadge({ status, type = 'task', size = 'default' }) {
  const getStatusConfig = () => {
    if (type === 'leave') {
      const configs = {
        pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
        approved: { label: 'Approved', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
        rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
      };
      return configs[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    }

    const configs = {
      todo: { label: 'To Do', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
      in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
      completed: { label: 'Completed', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
      blocked: { label: 'Blocked', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    };

    return configs[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
  };

  const config = getStatusConfig();
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : '';

  return (
    <Badge className={`${config.className} ${sizeClass}`}>
      {config.label}
    </Badge>
  );
}