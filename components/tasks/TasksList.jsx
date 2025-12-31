'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import TaskCard from './TaskCard';
import FilterBar from '@/components/ui/FilterBar';

export default function TasksList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', priority: 'all' });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data.data || []);
        setFilteredTasks(data.data || []);
      } catch (err) {
        console.error('Fetch tasks error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    let result = [...tasks];

    if (filters.status !== 'all') {
      result = result.filter(task => task.status === filters.status);
    }

    if (filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }

    setFilteredTasks(result);
  }, [filters, tasks]);

  const filterOptions = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'todo', label: 'To Do' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'blocked', label: 'Blocked' },
      ]
    },
    {
      id: 'priority',
      label: 'Priority',
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ]
    }
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
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
    <div className="space-y-6">
      <FilterBar filters={filters} setFilters={setFilters} options={filterOptions} />

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.task_id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}