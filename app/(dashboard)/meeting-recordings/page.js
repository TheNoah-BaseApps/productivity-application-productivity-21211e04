'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Video, Calendar, Clock, Users, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function MeetingRecordingsPage() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [formData, setFormData] = useState({
    recording_id: '',
    meeting_title: '',
    participants: '',
    recording_link: '',
    meeting_date: '',
    duration: ''
  });

  useEffect(() => {
    fetchRecordings();
  }, []);

  async function fetchRecordings() {
    try {
      setLoading(true);
      const response = await fetch('/api/meeting-recordings');
      const data = await response.json();
      if (data.success) {
        setRecordings(data.data);
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to load meeting recordings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('/api/meeting-recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Meeting recording added successfully');
        setShowAddModal(false);
        resetForm();
        fetchRecordings();
      } else {
        toast.error(data.error || 'Failed to add recording');
      }
    } catch (error) {
      console.error('Error adding recording:', error);
      toast.error('Failed to add recording');
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/meeting-recordings/${selectedRecording.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Meeting recording updated successfully');
        setShowEditModal(false);
        setSelectedRecording(null);
        resetForm();
        fetchRecordings();
      } else {
        toast.error(data.error || 'Failed to update recording');
      }
    } catch (error) {
      console.error('Error updating recording:', error);
      toast.error('Failed to update recording');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this recording?')) return;

    try {
      const response = await fetch(`/api/meeting-recordings/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Meeting recording deleted successfully');
        fetchRecordings();
      } else {
        toast.error(data.error || 'Failed to delete recording');
      }
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error('Failed to delete recording');
    }
  }

  function openEditModal(recording) {
    setSelectedRecording(recording);
    setFormData({
      recording_id: recording.recording_id,
      meeting_title: recording.meeting_title,
      participants: recording.participants || '',
      recording_link: recording.recording_link,
      meeting_date: recording.meeting_date?.split('T')[0] || '',
      duration: recording.duration || ''
    });
    setShowEditModal(true);
  }

  function resetForm() {
    setFormData({
      recording_id: '',
      meeting_title: '',
      participants: '',
      recording_link: '',
      meeting_date: '',
      duration: ''
    });
  }

  const totalRecordings = recordings.length;
  const totalDuration = recordings.reduce((sum, r) => sum + (parseInt(r.duration) || 0), 0);
  const avgDuration = totalRecordings > 0 ? Math.round(totalDuration / totalRecordings) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meeting recordings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Recordings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and access all meeting recordings</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Recording
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Recordings</CardTitle>
            <Video className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecordings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Duration</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDuration} min</div>
          </CardContent>
        </Card>
      </div>

      {/* Recordings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Recordings</CardTitle>
          <CardDescription>View and manage your meeting recordings</CardDescription>
        </CardHeader>
        <CardContent>
          {recordings.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recordings yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first meeting recording</p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Recording
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recording ID</TableHead>
                  <TableHead>Meeting Title</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recordings.map((recording) => (
                  <TableRow key={recording.id}>
                    <TableCell className="font-medium">{recording.recording_id}</TableCell>
                    <TableCell>{recording.meeting_title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{recording.participants || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(recording.meeting_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{recording.duration || 0} min</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(recording.recording_link, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(recording)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(recording.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Recording Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Meeting Recording</DialogTitle>
            <DialogDescription>Create a new meeting recording entry</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="recording_id">Recording ID *</Label>
                <Input
                  id="recording_id"
                  value={formData.recording_id}
                  onChange={(e) => setFormData({ ...formData, recording_id: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting_title">Meeting Title *</Label>
                <Input
                  id="meeting_title"
                  value={formData.meeting_title}
                  onChange={(e) => setFormData({ ...formData, meeting_title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participants">Participants</Label>
                <Input
                  id="participants"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                  placeholder="John Doe, Jane Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recording_link">Recording Link *</Label>
                <Input
                  id="recording_link"
                  type="url"
                  value={formData.recording_link}
                  onChange={(e) => setFormData({ ...formData, recording_link: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting_date">Meeting Date *</Label>
                <Input
                  id="meeting_date"
                  type="date"
                  value={formData.meeting_date}
                  onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="60"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Recording</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Recording Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Meeting Recording</DialogTitle>
            <DialogDescription>Update recording information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_recording_id">Recording ID *</Label>
                <Input
                  id="edit_recording_id"
                  value={formData.recording_id}
                  onChange={(e) => setFormData({ ...formData, recording_id: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_meeting_title">Meeting Title *</Label>
                <Input
                  id="edit_meeting_title"
                  value={formData.meeting_title}
                  onChange={(e) => setFormData({ ...formData, meeting_title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_participants">Participants</Label>
                <Input
                  id="edit_participants"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_recording_link">Recording Link *</Label>
                <Input
                  id="edit_recording_link"
                  type="url"
                  value={formData.recording_link}
                  onChange={(e) => setFormData({ ...formData, recording_link: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_meeting_date">Meeting Date *</Label>
                <Input
                  id="edit_meeting_date"
                  type="date"
                  value={formData.meeting_date}
                  onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_duration">Duration (minutes)</Label>
                <Input
                  id="edit_duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Recording</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}