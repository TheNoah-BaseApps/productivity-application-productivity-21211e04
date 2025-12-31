'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';
import { formatDate } from '@/lib/date-utils';
import { useRouter } from 'next/navigation';

export default function TaskCard({ task }) {
  const router = useRouter();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{task.task_description}</h3>
          <div className="flex flex-col gap-2">
            <StatusBadge status={task.status} type="task" />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.assigned_to_name && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{task.assigned_to_name}</span>
          </div>
        )}
        {task.due_date && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Due: {formatDate(task.due_date)}</span>
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => router.push(`/tasks/${task.task_id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}