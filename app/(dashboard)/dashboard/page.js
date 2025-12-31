'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import MetricsWidget from '@/components/dashboard/MetricsWidget';
import WorkloadDistribution from '@/components/dashboard/WorkloadDistribution';
import UpcomingTasks from '@/components/dashboard/UpcomingTasks';
import PendingApprovals from '@/components/dashboard/PendingApprovals';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/metrics');
        if (!response.ok) throw new Error('Failed to fetch dashboard metrics');
        const data = await response.json();
        setMetrics(data.data);
      } catch (err) {
        console.error('Dashboard metrics error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your productivity and team performance</p>
      </div>

      <MetricsWidget metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkloadDistribution data={metrics?.workloadDistribution} />
        <PendingApprovals />
      </div>

      <UpcomingTasks />
    </div>
  );
}