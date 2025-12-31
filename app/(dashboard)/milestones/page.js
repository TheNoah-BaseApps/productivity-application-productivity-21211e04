'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import MilestonesList from '@/components/milestones/MilestonesList';
import MilestoneForm from '@/components/milestones/MilestoneForm';

export default function MilestonesPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSuccess = () => {
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Milestones</h1>
          <p className="text-gray-600 mt-1">Track project milestones and deliverables</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Milestone
        </Button>
      </div>

      <MilestonesList />

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Milestone</DialogTitle>
          </DialogHeader>
          <MilestoneForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}