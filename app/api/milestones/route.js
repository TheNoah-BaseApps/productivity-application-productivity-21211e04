/**
 * @swagger
 * /api/milestones:
 *   get:
 *     summary: Get all milestones
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Milestones retrieved successfully
 *   post:
 *     summary: Create new milestone
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Milestone created successfully
 */

import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await query(
      'SELECT * FROM milestones ORDER BY target_date ASC'
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get milestones error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch milestones' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    if (!milestone_name || !target_date) {
      return NextResponse.json(
        { success: false, error: 'Milestone name and target date are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO milestones (milestone_name, description, target_date, status, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [milestone_name, description, target_date, status || 'not_started', authResult.user.userId]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Milestone created successfully',
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create milestone error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create milestone' },
      { status: 500 }
    );
  }
}