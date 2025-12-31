'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import UserSelector from '@/components/ui/UserSelector';

const STATUSES = ['todo', 'in_progress', 'completed', 'blocked'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export default function TaskForm({ task = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    task_description: task?.task_description || '',
    task_details: task?.task_details || '',
    assigned_to: task?.assigned_to || null,
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    due_date: task?.due_date || '',
    associated_milestone_id: task?.associated_milestone_id || null
  });
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await fetch('/api/milestones');
        if (response.ok) {
          const data = await response.json();
          setMilestones(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch milestones:', err);
      }
    };

    fetchMilestones();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = task ? `/api/tasks/${task.task_id}` : '/api/tasks';
      const method = task ? 'PUT' : 'POST';

      const submitData = {
        ...formData,
        associated_milestone_id: formData.associated_milestone_id || null,
        assigned_to: formData.assigned_to || null
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save task');
      }

      toast.success(`Task ${task ? 'updated' : 'created'} successfully!`);
      
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.error('Task form error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="task_description">Task Description</Label>
        <Input
          id="task_description"
          placeholder="Enter task description"
          value={formData.task_description}
          onChange={(e) => setFormData({ ...formData, task_description: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="task_details">Task Details</Label>
        <Textarea
          id="task_details"
          placeholder="Enter detailed task information..."
          value={formData.task_details}
          onChange={(e) => setFormData({ ...formData, task_details: e.target.value })}
          rows={4}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Assigned To</Label>
          <UserSelector
            value={formData.assigned_to}
            onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map(status => (
                <SelectItem key={status} value={status}>
                  {status.replace('_', ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value })}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map(priority => (
                <SelectItem key={priority} value={priority}>
                  {priority.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="milestone">Associated Milestone (Optional)</Label>
        <Select
          value={formData.associated_milestone_id || undefined}
          onValueChange={(value) => setFormData({ ...formData, associated_milestone_id: value })}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select milestone" />
          </SelectTrigger>
          <SelectContent>
            {milestones.map(milestone => (
              <SelectItem key={milestone.milestone_id} value={milestone.milestone_id}>
                {milestone.milestone_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {task ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            task ? 'Update Task' : 'Create Task'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}