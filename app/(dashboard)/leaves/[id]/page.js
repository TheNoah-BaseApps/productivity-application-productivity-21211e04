'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, Calendar, User, FileText } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/date-utils';

export default function LeaveDetailPage({ params }) {
  const router = useRouter();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leaves/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch leave details');
        const data = await response.json();
        setLeave(data.data);
      } catch (err) {
        console.error('Leave detail error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchLeave();
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

  if (!leave) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Leave request not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Leave Request Details</h1>
          <p className="text-gray-600 mt-1">View leave request information</p>
        </div>
        <StatusBadge status={leave.approval_status} type="leave" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <User className="h-4 w-4" />
                Employee
              </label>
              <p className="text-lg font-medium mt-1">{leave.employee_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Leave Type
              </label>
              <p className="text-lg font-medium mt-1">{leave.leave_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </label>
              <p className="text-lg font-medium mt-1">{formatDate(leave.start_date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date
              </label>
              <p className="text-lg font-medium mt-1">{formatDate(leave.end_date)}</p>
            </div>
          </div>

          {leave.reason && (
            <div>
              <label className="text-sm font-medium text-gray-500">Reason</label>
              <p className="text-gray-900 mt-1">{leave.reason}</p>
            </div>
          )}

          {leave.approval_notes && (
            <div>
              <label className="text-sm font-medium text-gray-500">Approval Notes</label>
              <p className="text-gray-900 mt-1">{leave.approval_notes}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span> {formatDate(leave.created_at, true)}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {formatDate(leave.updated_at, true)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}