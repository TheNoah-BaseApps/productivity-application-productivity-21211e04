'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertCircle, Calendar, User } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/date-utils';
import { toast } from 'sonner';

export default function LeaveApprovalPanel() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState({});

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaves?status=pending');
      if (!response.ok) throw new Error('Failed to fetch pending leaves');
      const data = await response.json();
      setLeaves(data.data || []);
    } catch (err) {
      console.error('Fetch leaves error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApproval = async (leaveId, status) => {
    setProcessingId(leaveId);
    try {
      const response = await fetch(`/api/leaves/${leaveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approval_status: status,
          approval_notes: approvalNotes[leaveId] || ''
        }),
      });

      if (!response.ok) throw new Error('Failed to update leave status');

      toast.success(`Leave ${status} successfully`);
      setApprovalNotes({ ...approvalNotes, [leaveId]: '' });
      await fetchLeaves();
    } catch (err) {
      console.error('Approval error:', err);
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
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

  if (leaves.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">No pending leave requests</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {leaves.map((leave) => (
        <Card key={leave.leave_id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{leave.employee_name}</CardTitle>
                  <p className="text-sm text-gray-600">{leave.leave_type}</p>
                </div>
              </div>
              <StatusBadge status={leave.approval_status} type="leave" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Start:</span>
                <span className="font-medium">{formatDate(leave.start_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">End:</span>
                <span className="font-medium">{formatDate(leave.end_date)}</span>
              </div>
            </div>

            {leave.reason && (
              <div>
                <Label className="text-sm font-medium">Reason:</Label>
                <p className="text-sm text-gray-600 mt-1">{leave.reason}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor={`notes-${leave.leave_id}`}>Approval Notes (Optional)</Label>
              <Textarea
                id={`notes-${leave.leave_id}`}
                placeholder="Add any notes about this decision..."
                value={approvalNotes[leave.leave_id] || ''}
                onChange={(e) => setApprovalNotes({ 
                  ...approvalNotes, 
                  [leave.leave_id]: e.target.value 
                })}
                rows={2}
                disabled={processingId === leave.leave_id}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => handleApproval(leave.leave_id, 'approved')}
                disabled={processingId === leave.leave_id}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                onClick={() => handleApproval(leave.leave_id, 'rejected')}
                disabled={processingId === leave.leave_id}
                variant="destructive"
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}