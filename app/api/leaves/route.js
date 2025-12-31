/**
 * @swagger
 * /api/leaves:
 *   get:
 *     summary: Get all leaves
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leaves retrieved successfully
 *   post:
 *     summary: Create new leave request
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Leave created successfully
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    let sql = `
      SELECT l.*, u.name as employee_name 
      FROM leaves l
      LEFT JOIN users u ON l.employee_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // Filter by role
    if (authResult.user.role === 'employee') {
      sql += ` AND l.employee_id = $${paramCount}`;
      params.push(authResult.user.userId);
      paramCount++;
    }

    if (status && status !== 'all') {
      sql += ` AND l.approval_status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    sql += ' ORDER BY l.created_at DESC';

    if (limit) {
      sql += ` LIMIT $${paramCount}`;
      params.push(parseInt(limit));
    }

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get leaves error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaves' },
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
    const { leave_type, start_date, end_date, reason } = body;

    if (!leave_type || !start_date || !end_date) {
      return NextResponse.json(
        { success: false, error: 'Leave type, start date, and end date are required' },
        { status: 400 }
      );
    }

    if (new Date(end_date) < new Date(start_date)) {
      return NextResponse.json(
        { success: false, error: 'End date must be after or equal to start date' },
        { status: 400 }
      );
    }

    // Get user name
    const userResult = await query(
      'SELECT name FROM users WHERE id = $1',
      [authResult.user.userId]
    );

    const result = await query(
      `INSERT INTO leaves (employee_id, employee_name, leave_type, start_date, end_date, reason, approval_status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW(), NOW())
       RETURNING *`,
      [authResult.user.userId, userResult.rows[0]?.name, leave_type, start_date, end_date, reason]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Leave request created successfully',
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create leave error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create leave request' },
      { status: 500 }
    );
  }
}