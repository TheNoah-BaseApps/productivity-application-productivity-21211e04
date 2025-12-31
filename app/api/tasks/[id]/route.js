/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task updated successfully
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */

import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await query(
      `SELECT t.*, u.name as assigned_to_name, m.milestone_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       LEFT JOIN milestones m ON t.associated_milestone_id = m.milestone_id
       WHERE t.task_id = $1`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      task_description,
      task_details,
      assigned_to,
      status,
      priority,
      due_date,
      associated_milestone_id,
    } = body;

    const updates = [];
    const params_list = [];
    let paramCount = 1;

    if (task_description !== undefined) {
      updates.push(`task_description = $${paramCount}`);
      params_list.push(task_description);
      paramCount++;
    }
    if (task_details !== undefined) {
      updates.push(`task_details = $${paramCount}`);
      params_list.push(task_details);
      paramCount++;
    }
    if (assigned_to !== undefined) {
      updates.push(`assigned_to = $${paramCount}`);
      params_list.push(assigned_to || null);
      paramCount++;
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      params_list.push(status);
      paramCount++;

      if (status === 'completed') {
        updates.push(`completion_date = NOW()`);
      }
    }
    if (priority !== undefined) {
      updates.push(`priority = $${paramCount}`);
      params_list.push(priority);
      paramCount++;
    }
    if (due_date !== undefined) {
      updates.push(`due_date = $${paramCount}`);
      params_list.push(due_date || null);
      paramCount++;
    }
    if (associated_milestone_id !== undefined) {
      updates.push(`associated_milestone_id = $${paramCount}`);
      params_list.push(associated_milestone_id || null);
      paramCount++;
    }

    updates.push('last_updated_date = NOW()');
    params_list.push(params.id);

    const result = await query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE task_id = $${paramCount} RETURNING *`,
      params_list
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Task updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await query(
      'DELETE FROM tasks WHERE task_id = $1 RETURNING task_id',
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}