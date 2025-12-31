/**
 * @swagger
 * /api/leaves/{id}:
 *   get:
 *     summary: Get leave by ID
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave retrieved successfully
 *   put:
 *     summary: Update leave (approval status)
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave updated successfully
 *   delete:
 *     summary: Delete leave
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave deleted successfully
 */

import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { query } from '@/lib/db';
import { hasPermission } from '@/lib/permissions';

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
      'SELECT * FROM leaves WHERE leave_id = $1',
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Leave not found' },
        { status: 404 }
      );
    }

    const leave = result.rows[0];

    // Check permission
    if (
      authResult.user.role === 'employee' &&
      leave.employee_id !== authResult.user.userId
    ) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: leave,
    });
  } catch (error) {
    console.error('Get leave error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leave' },
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
    const { approval_status, approval_notes } = body;

    // Only managers and admins can approve/reject
    if (!hasPermission(authResult.user.role, ['admin', 'manager'])) {
      return NextResponse.json(
        { success: false, error: 'Only managers and admins can approve/reject leave requests' },
        { status: 403 }
      );
    }

    if (!['approved', 'rejected'].includes(approval_status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid approval status' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE leaves 
       SET approval_status = $1, approved_by = $2, approval_notes = $3, updated_at = NOW()
       WHERE leave_id = $4
       RETURNING *`,
      [approval_status, authResult.user.userId, approval_notes, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Leave not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Leave status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update leave error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update leave' },
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

    // Check if leave exists and belongs to user
    const checkResult = await query(
      'SELECT employee_id FROM leaves WHERE leave_id = $1',
      [params.id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Leave not found' },
        { status: 404 }
      );
    }

    if (
      authResult.user.role === 'employee' &&
      checkResult.rows[0].employee_id !== authResult.user.userId
    ) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own leave requests' },
        { status: 403 }
      );
    }

    await query('DELETE FROM leaves WHERE leave_id = $1', [params.id]);

    return NextResponse.json({
      success: true,
      message: 'Leave deleted successfully',
    });
  } catch (error) {
    console.error('Delete leave error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete leave' },
      { status: 500 }
    );
  }
}