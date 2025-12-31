'use client';

import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export default function PriorityBadge({ priority }) {
  const getPriorityConfig = () => {
    const configs = {
      urgent: { 
        label: 'Urgent', 
        className: 'bg-red-100 text-red-800 hover:bg-red-100',
        icon: true
      },
      high: { 
        label: 'High', 
        className: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
        icon: true
      },
      medium: { 
        label: 'Medium', 
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        icon: false
      },
      low: { 
        label: 'Low', 
        className: 'bg-green-100 text-green-800 hover:bg-green-100',
        icon: false
      },
    };

    return configs[priority] || configs.medium;
  };

  const config = getPriorityConfig();

  return (
    <Badge className={`${config.className} flex items-center gap-1`}>
      {config.icon && <AlertCircle className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}