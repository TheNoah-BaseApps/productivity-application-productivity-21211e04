'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Calendar, User, ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/date-utils';
import { useRouter } from 'next/navigation';

export default function PendingApprovals() {
  const router = useRouter();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, leavesRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/leaves?status=pending&limit=5')
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUserRole(userData.user?.role);
        }

        if (leavesRes.ok) {
          const leavesData = await leavesRes.json();
          setLeaves(leavesData.data || []);
        }
      } catch (err) {
        console.error('Pending approvals error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!['admin', 'manager'].includes(userRole)) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Leave requests awaiting your review</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push('/leaves/approvals')}>
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {leaves.length === 0 ? (
          <p className="text-gray-600 text-center py-6">No pending approvals</p>
        ) : (
          <div className="space-y-3">
            {leaves.map((leave) => (
              <div
                key={leave.leave_id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => router.push('/leaves/approvals')}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900">{leave.employee_name}</p>
                      <p className="text-sm text-gray-600">{leave.leave_type}</p>
                    </div>
                    <StatusBadge status={leave.approval_status} type="leave" size="sm" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(leave.start_date)} - {formatDate(leave.end_date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}