'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import LeaveCard from './LeaveCard';
import FilterBar from '@/components/ui/FilterBar';

export default function LeavesList() {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', type: 'all' });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leaves');
        if (!response.ok) throw new Error('Failed to fetch leaves');
        const data = await response.json();
        setLeaves(data.data || []);
        setFilteredLeaves(data.data || []);
      } catch (err) {
        console.error('Fetch leaves error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  useEffect(() => {
    let result = [...leaves];

    if (filters.status !== 'all') {
      result = result.filter(leave => leave.approval_status === filters.status);
    }

    if (filters.type !== 'all') {
      result = result.filter(leave => leave.leave_type === filters.type);
    }

    setFilteredLeaves(result);
  }, [filters, leaves]);

  const filterOptions = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
      ]
    },
    {
      id: 'type',
      label: 'Type',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'Annual Leave', label: 'Annual Leave' },
        { value: 'Sick Leave', label: 'Sick Leave' },
        { value: 'Personal Leave', label: 'Personal Leave' },
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

      {filteredLeaves.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No leave requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeaves.map((leave) => (
            <LeaveCard key={leave.leave_id} leave={leave} />
          ))}
        </div>
      )}
    </div>
  );
}