'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Pencil, Trash2, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];

export default function ProductRequirementsPage() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [formData, setFormData] = useState({
    requirement_id: '',
    customer_id: '',
    document_source: '',
    feature_description: '',
    priority: 'Medium',
    associated_product: '',
    requirement_date: '',
    status: 'Pending',
    no_of_sprints: '',
    cost: '',
    q_cparameters: ''
  });

  useEffect(() => {
    fetchRequirements();
  }, [filters]);

  async function fetchRequirements() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await fetch(`/api/product-requirements?${params}`);
      const data = await response.json();
      if (data.success) {
        setRequirements(data.data);
      }
    } catch (error) {
      console.error('Error fetching requirements:', error);
      toast.error('Failed to load product requirements');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('/api/product-requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Product requirement added successfully');
        setShowAddModal(false);
        resetForm();
        fetchRequirements();
      } else {
        toast.error(data.error || 'Failed to add requirement');
      }
    } catch (error) {
      console.error('Error adding requirement:', error);
      toast.error('Failed to add requirement');
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/product-requirements/${selectedRequirement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Product requirement updated successfully');
        setShowEditModal(false);
        setSelectedRequirement(null);
        resetForm();
        fetchRequirements();
      } else {
        toast.error(data.error || 'Failed to update requirement');
      }
    } catch (error) {
      console.error('Error updating requirement:', error);
      toast.error('Failed to update requirement');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this requirement?')) return;

    try {
      const response = await fetch(`/api/product-requirements/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Product requirement deleted successfully');
        fetchRequirements();
      } else {
        toast.error(data.error || 'Failed to delete requirement');
      }
    } catch (error) {
      console.error('Error deleting requirement:', error);
      toast.error('Failed to delete requirement');
    }
  }

  function openEditModal(requirement) {
    setSelectedRequirement(requirement);
    setFormData({
      requirement_id: requirement.requirement_id,
      customer_id: requirement.customer_id || '',
      document_source: requirement.document_source || '',
      feature_description: requirement.feature_description,
      priority: requirement.priority,
      associated_product: requirement.associated_product || '',
      requirement_date: requirement.requirement_date?.split('T')[0] || '',
      status: requirement.status,
      no_of_sprints: requirement.no_of_sprints || '',
      cost: requirement.cost || '',
      q_cparameters: requirement.q_cparameters || ''
    });
    setShowEditModal(true);
  }

  function resetForm() {
    setFormData({
      requirement_id: '',
      customer_id: '',
      document_source: '',
      feature_description: '',
      priority: 'Medium',
      associated_product: '',
      requirement_date: '',
      status: 'Pending',
      no_of_sprints: '',
      cost: '',
      q_cparameters: ''
    });
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'secondary';
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Pending': return 'outline';
      default: return 'secondary';
    }
  }

  const totalRequirements = requirements.length;
  const totalCost = requirements.reduce((sum, r) => sum + (parseInt(r.cost) || 0), 0);
  const totalSprints = requirements.reduce((sum, r) => sum + (parseInt(r.no_of_sprints) || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Requirements</h1>
          <p className="text-sm text-gray-600 mt-1">Track and manage product feature requirements</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Requirement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Requirements</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequirements}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sprints</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSprints}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  {PRIORITY_OPTIONS.map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Requirements</CardTitle>
          <CardDescription>View and manage product requirements</CardDescription>
        </CardHeader>
        <CardContent>
          {requirements.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requirements yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first product requirement</p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Req ID</TableHead>
                    <TableHead>Feature</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Sprints</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requirements.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.requirement_id}</TableCell>
                      <TableCell className="max-w-xs truncate">{req.feature_description}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(req.priority)}>{req.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(req.status)}>{req.status}</Badge>
                      </TableCell>
                      <TableCell>{req.associated_product || 'N/A'}</TableCell>
                      <TableCell>{req.no_of_sprints || 0}</TableCell>
                      <TableCell>${req.cost || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(req)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(req.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Requirement Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Product Requirement</DialogTitle>
            <DialogDescription>Create a new product requirement entry</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requirement_id">Requirement ID *</Label>
                  <Input
                    id="requirement_id"
                    value={formData.requirement_id}
                    onChange={(e) => setFormData({ ...formData, requirement_id: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_id">Customer ID</Label>
                  <Input
                    id="customer_id"
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feature_description">Feature Description *</Label>
                <Textarea
                  id="feature_description"
                  value={formData.feature_description}
                  onChange={(e) => setFormData({ ...formData, feature_description: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="associated_product">Associated Product</Label>
                  <Input
                    id="associated_product"
                    value={formData.associated_product}
                    onChange={(e) => setFormData({ ...formData, associated_product: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document_source">Document Source</Label>
                  <Input
                    id="document_source"
                    value={formData.document_source}
                    onChange={(e) => setFormData({ ...formData, document_source: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requirement_date">Date *</Label>
                  <Input
                    id="requirement_date"
                    type="date"
                    value={formData.requirement_date}
                    onChange={(e) => setFormData({ ...formData, requirement_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="no_of_sprints">Sprints</Label>
                  <Input
                    id="no_of_sprints"
                    type="number"
                    value={formData.no_of_sprints}
                    onChange={(e) => setFormData({ ...formData, no_of_sprints: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="q_cparameters">Q/C Parameters</Label>
                <Textarea
                  id="q_cparameters"
                  value={formData.q_cparameters}
                  onChange={(e) => setFormData({ ...formData, q_cparameters: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Requirement</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Requirement Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product Requirement</DialogTitle>
            <DialogDescription>Update requirement information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_requirement_id">Requirement ID *</Label>
                  <Input
                    id="edit_requirement_id"
                    value={formData.requirement_id}
                    onChange={(e) => setFormData({ ...formData, requirement_id: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_customer_id">Customer ID</Label>
                  <Input
                    id="edit_customer_id"
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_feature_description">Feature Description *</Label>
                <Textarea
                  id="edit_feature_description"
                  value={formData.feature_description}
                  onChange={(e) => setFormData({ ...formData, feature_description: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_priority">Priority *</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_associated_product">Associated Product</Label>
                  <Input
                    id="edit_associated_product"
                    value={formData.associated_product}
                    onChange={(e) => setFormData({ ...formData, associated_product: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_document_source">Document Source</Label>
                  <Input
                    id="edit_document_source"
                    value={formData.document_source}
                    onChange={(e) => setFormData({ ...formData, document_source: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_requirement_date">Date *</Label>
                  <Input
                    id="edit_requirement_date"
                    type="date"
                    value={formData.requirement_date}
                    onChange={(e) => setFormData({ ...formData, requirement_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_no_of_sprints">Sprints</Label>
                  <Input
                    id="edit_no_of_sprints"
                    type="number"
                    value={formData.no_of_sprints}
                    onChange={(e) => setFormData({ ...formData, no_of_sprints: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_cost">Cost ($)</Label>
                  <Input
                    id="edit_cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_q_cparameters">Q/C Parameters</Label>
                <Textarea
                  id="edit_q_cparameters"
                  value={formData.q_cparameters}
                  onChange={(e) => setFormData({ ...formData, q_cparameters: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Requirement</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}