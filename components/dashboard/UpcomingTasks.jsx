'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import PriorityBadge from '@/components/ui/PriorityBadge';
import { useRouter } from 'next/navigation';

export default function UpcomingTasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tasks?limit=5&upcoming=true');
        if (!response.ok) throw new Error('Failed to fetch upcoming tasks');
        const data = await response.json();
        setTasks(data.data || []);
      } catch (err) {
        console.error('Upcoming tasks error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>Your tasks with approaching deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-gray-600 text-center py-6">No upcoming tasks</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.task_id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => router.push(`/tasks/${task.task_id}`)}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 line-clamp-1">{task.task_description}</p>
                  {task.due_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(task.due_date)}</span>
                    </div>
                  )}
                </div>
                <PriorityBadge priority={task.priority} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}