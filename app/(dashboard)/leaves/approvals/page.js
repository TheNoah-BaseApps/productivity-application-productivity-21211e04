'use client';

import RoleGuard from '@/components/auth/RoleGuard';
import LeaveApprovalPanel from '@/components/leaves/LeaveApprovalPanel';

export default function LeaveApprovalsPage() {
  return (
    <RoleGuard allowedRoles={['admin', 'manager']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Approvals</h1>
          <p className="text-gray-600 mt-1">Review and approve team leave requests</p>
        </div>

        <LeaveApprovalPanel />
      </div>
    </RoleGuard>
  );
}