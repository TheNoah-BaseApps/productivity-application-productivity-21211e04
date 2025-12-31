'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import TaskCard from './TaskCard';

const STATUSES = [
  { value: 'todo', label: 'To Do', color: 'bg-gray-100' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100' },
  { value: 'blocked', label: 'Blocked', color: 'bg-red-100' },
];

export default function TaskKanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data.data || []);
      } catch (err) {
        console.error('Fetch tasks error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-96" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATUSES.map((status) => {
        const statusTasks = tasks.filter(task => task.status === status.value);
        return (
          <Card key={status.value} className={status.color}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>{status.label}</span>
                <span className="text-sm font-normal text-gray-600">
                  {statusTasks.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statusTasks.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No tasks</p>
                ) : (
                  statusTasks.map((task) => (
                    <TaskCard key={task.task_id} task={task} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}