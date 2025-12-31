/**
 * @swagger
 * /api/milestones/{id}:
 *   get:
 *     summary: Get milestone by ID
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Milestone retrieved successfully
 *   put:
 *     summary: Update milestone
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Milestone updated successfully
 *   delete:
 *     summary: Delete milestone
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Milestone deleted successfully
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
      'SELECT * FROM milestones WHERE milestone_id = $1',
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get milestone error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch milestone' },
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
    const { milestone_name, description, target_date, status } = body;

    const updates = [];
    const params_list = [];
    let paramCount = 1;

    if (milestone_name !== undefined) {
      updates.push(`milestone_name = $${paramCount}`);
      params_list.push(milestone_name);
      paramCount++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      params_list.push(description);
      paramCount++;
    }
    if (target_date !== undefined) {
      updates.push(`target_date = $${paramCount}`);
      params_list.push(target_date);
      paramCount++;
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      params_list.push(status);
      paramCount++;
    }

    params_list.push(params.id);

    const result = await query(
      `UPDATE milestones SET ${updates.join(', ')} WHERE milestone_id = $${paramCount} RETURNING *`,
      params_list
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Milestone updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update milestone error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update milestone' },
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
      'DELETE FROM milestones WHERE milestone_id = $1 RETURNING milestone_id',
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Milestone deleted successfully',
    });
  } catch (error) {
    console.error('Delete milestone error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete milestone' },
      { status: 500 }
    );
  }
}