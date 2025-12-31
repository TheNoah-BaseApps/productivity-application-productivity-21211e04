'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MetricsWidget from '@/components/dashboard/MetricsWidget';
import WorkloadDistribution from '@/components/dashboard/WorkloadDistribution';
import UpcomingTasks from '@/components/dashboard/UpcomingTasks';
import PendingApprovals from '@/components/dashboard/PendingApprovals';
import { AlertCircle, Video, FileText } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recordingsCount, setRecordingsCount] = useState(0);
  const [requirementsCount, setRequirementsCount] = useState(0);

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

    const fetchRecordingsCount = async () => {
      try {
        const response = await fetch('/api/meeting-recordings?limit=1');
        if (response.ok) {
          const data = await response.json();
          setRecordingsCount(data.total || 0);
        }
      } catch (err) {
        console.error('Failed to fetch recordings count:', err);
      }
    };

    const fetchRequirementsCount = async () => {
      try {
        const response = await fetch('/api/product-requirements?limit=1');
        if (response.ok) {
          const data = await response.json();
          setRequirementsCount(data.total || 0);
        }
      } catch (err) {
        console.error('Failed to fetch requirements count:', err);
      }
    };

    fetchMetrics();
    fetchRecordingsCount();
    fetchRequirementsCount();
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/meeting-recordings" className="block transition-transform hover:scale-105">
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Meeting Recordings</CardTitle>
              <Video className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">Access and manage all meeting recordings</CardDescription>
              <div className="text-2xl font-bold">{recordingsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Total recordings</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/product-requirements" className="block transition-transform hover:scale-105">
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Product Requirements</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">Track product features and requirements</CardDescription>
              <div className="text-2xl font-bold">{requirementsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Total requirements</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkloadDistribution data={metrics?.workloadDistribution} />
        <PendingApprovals />
      </div>

      <UpcomingTasks />
    </div>
  );
}