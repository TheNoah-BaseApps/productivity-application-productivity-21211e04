'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import TaskDetailView from '@/components/tasks/TaskDetailView';

export default function TaskDetailPage({ params }) {
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch task details');
      const data = await response.json();
      setTask(data.data);
    } catch (err) {
      console.error('Task detail error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchTask();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
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

  if (!task) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Task not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
          <p className="text-gray-600 mt-1">View and manage task information</p>
        </div>
      </div>

      <TaskDetailView task={task} onUpdate={fetchTask} />
    </div>
  );
}