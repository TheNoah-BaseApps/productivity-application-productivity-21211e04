'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, User, Edit, Trash2 } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';
import TaskForm from './TaskForm';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { formatDate } from '@/lib/date-utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function TaskDetailView({ task, onUpdate }) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${task.task_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      toast.success('Task deleted successfully');
      router.push('/tasks');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl">{task.task_description}</CardTitle>
            <div className="flex gap-2">
              <StatusBadge status={task.status} type="task" />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {task.task_details && (
            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{task.task_details}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {task.assigned_to_name && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assigned To
                </label>
                <p className="text-lg font-medium mt-1">{task.assigned_to_name}</p>
              </div>
            )}

            {task.due_date && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </label>
                <p className="text-lg font-medium mt-1">{formatDate(task.due_date)}</p>
              </div>
            )}

            {task.milestone_name && (
              <div>
                <label className="text-sm font-medium text-gray-500">Milestone</label>
                <p className="text-lg font-medium mt-1">{task.milestone_name}</p>
              </div>
            )}

            {task.completion_date && (
              <div>
                <label className="text-sm font-medium text-gray-500">Completed On</label>
                <p className="text-lg font-medium mt-1">{formatDate(task.completion_date, true)}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span> {formatDate(task.creation_date, true)}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {formatDate(task.last_updated_date, true)}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => setShowEditModal(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm task={task} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        loading={deleting}
      />
    </>
  );
}