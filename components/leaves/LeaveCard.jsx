'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/date-utils';
import { useRouter } from 'next/navigation';

export default function LeaveCard({ leave }) {
  const router = useRouter();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{leave.employee_name}</h3>
              <p className="text-sm text-gray-600">{leave.leave_type}</p>
            </div>
          </div>
          <StatusBadge status={leave.approval_status} type="leave" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(leave.start_date)} - {formatDate(leave.end_date)}</span>
        </div>
        {leave.reason && (
          <p className="text-sm text-gray-600 line-clamp-2">{leave.reason}</p>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => router.push(`/leaves/${leave.leave_id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}