'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [metricsRes, tasksRes, leavesRes] = await Promise.all([
          fetch('/api/dashboard/metrics'),
          fetch('/api/tasks'),
          fetch('/api/leaves')
        ]);

        if (!metricsRes.ok || !tasksRes.ok || !leavesRes.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const [metrics, tasks, leaves] = await Promise.all([
          metricsRes.json(),
          tasksRes.json(),
          leavesRes.json()
        ]);

        setData({
          metrics: metrics.data,
          tasks: tasks.data,
          leaves: leaves.data
        });
      } catch (err) {
        console.error('Analytics error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
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

  const completedTasks = data?.tasks?.filter(t => t.status === 'completed').length || 0;
  const totalTasks = data?.tasks?.length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const approvedLeaves = data?.leaves?.filter(l => l.approval_status === 'approved').length || 0;
  const pendingLeaves = data?.leaves?.filter(l => l.approval_status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Insights into productivity and team performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Task completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLeaves}</div>
            <p className="text-xs text-muted-foreground mt-1">
              This period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLeaves}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>Tasks by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['todo', 'in_progress', 'completed', 'blocked'].map(status => {
                const count = data?.tasks?.filter(t => t.status === status).length || 0;
                const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{status.replace('_', ' ')}</span>
                      <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['urgent', 'high', 'medium', 'low'].map(priority => {
                const count = data?.tasks?.filter(t => t.priority === priority).length || 0;
                const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                const colors = {
                  urgent: 'bg-red-600',
                  high: 'bg-orange-600',
                  medium: 'bg-yellow-600',
                  low: 'bg-green-600'
                };
                return (
                  <div key={priority}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{priority}</span>
                      <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${colors[priority]} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}