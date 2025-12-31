'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TaskForm from '@/components/tasks/TaskForm';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function NewTaskPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    toast({
      title: 'Success',
      description: 'Task created successfully',
    });
    router.push('/tasks');
  };

  const handleError = (error) => {
    toast({
      title: 'Error',
      description: error?.message || 'Failed to create task',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push('/tasks')}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Task</h1>
          <p className="text-gray-600 mt-1">Add a new task to the system</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>Fill in the task information below</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm 
            onSuccess={handleSuccess}
            onError={handleError}
            onSubmitStateChange={setIsSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}