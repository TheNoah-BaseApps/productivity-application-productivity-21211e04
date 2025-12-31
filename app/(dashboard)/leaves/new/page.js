'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import LeaveRequestForm from '@/components/leaves/LeaveRequestForm';

export default function NewLeavePage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Request Leave</h1>
          <p className="text-gray-600 mt-1">Submit a new leave request for approval</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Request Details</CardTitle>
          <CardDescription>Fill in the details for your leave request</CardDescription>
        </CardHeader>
        <CardContent>
          <LeaveRequestForm />
        </CardContent>
      </Card>
    </div>
  );
}