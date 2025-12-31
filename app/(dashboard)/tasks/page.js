'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TasksList from '@/components/tasks/TasksList';
import TaskKanbanBoard from '@/components/tasks/TaskKanbanBoard';

export default function TasksPage() {
  const router = useRouter();
  const [view, setView] = useState('list');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track your tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
              <TabsTrigger value="kanban">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Kanban
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => router.push('/tasks/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {view === 'list' ? <TasksList /> : <TaskKanbanBoard />}
    </div>
  );
}