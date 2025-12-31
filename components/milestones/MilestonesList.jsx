'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import MilestoneCard from './MilestoneCard';

export default function MilestonesList() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/milestones');
        if (!response.ok) throw new Error('Failed to fetch milestones');
        const data = await response.json();
        setMilestones(data.data || []);
      } catch (err) {
        console.error('Fetch milestones error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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

  if (milestones.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No milestones found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {milestones.map((milestone) => (
        <MilestoneCard key={milestone.milestone_id} milestone={milestone} />
      ))}
    </div>
  );
}