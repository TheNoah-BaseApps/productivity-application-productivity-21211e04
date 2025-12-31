'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';

export default function MilestoneCard({ milestone }) {
  const statusColors = {
    'not_started': 'bg-gray-100 text-gray-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'delayed': 'bg-red-100 text-red-800',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{milestone.milestone_name}</h3>
            </div>
          </div>
          <Badge className={statusColors[milestone.status] || statusColors.not_started}>
            {milestone.status?.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {milestone.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{milestone.description}</p>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Target: {formatDate(milestone.target_date)}</span>
        </div>
      </CardContent>
    </Card>
  );
}