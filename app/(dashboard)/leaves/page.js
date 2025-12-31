'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LeavesList from '@/components/leaves/LeavesList';

export default function LeavesPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600 mt-1">Manage and track leave requests</p>
        </div>
        <Button onClick={() => router.push('/leaves/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Request Leave
        </Button>
      </div>

      <LeavesList />
    </div>
  );
}