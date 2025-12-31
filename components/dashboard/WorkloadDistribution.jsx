'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function WorkloadDistribution({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workload Distribution</CardTitle>
          <CardDescription>Task distribution across team members</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-6">No workload data available</p>
        </CardContent>
      </Card>
    );
  }

  const maxTasks = Math.max(...data.map(d => d.taskCount || 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workload Distribution</CardTitle>
        <CardDescription>Task distribution across team members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((member, index) => {
            const percentage = maxTasks > 0 ? (member.taskCount / maxTasks) * 100 : 0;
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{member.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{member.taskCount} tasks</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}