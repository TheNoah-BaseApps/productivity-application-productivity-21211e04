/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *   post:
 *     summary: Create new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Task created successfully
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
    const priority = searchParams.get('priority');
    const limit = searchParams.get('limit');
    const upcoming = searchParams.get('upcoming');

    let sql = `
      SELECT t.*, u.name as assigned_to_name, m.milestone_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN milestones m ON t.associated_milestone_id = m.milestone_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // Filter by role
    if (authResult.user.role === 'employee') {
      sql += ` AND t.assigned_to = $${paramCount}`;
      params.push(authResult.user.userId);
      paramCount++;
    }

    if (status && status !== 'all') {
      sql += ` AND t.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (priority && priority !== 'all') {
      sql += ` AND t.priority = $${paramCount}`;
      params.push(priority);
      paramCount++;
    }

    if (upcoming === 'true') {
      sql += ` AND t.due_date IS NOT NULL AND t.due_date >= CURRENT_DATE AND t.status != 'completed'`;
    }

    sql += ' ORDER BY t.creation_date DESC';

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
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
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
    const {
      task_description,
      task_details,
      assigned_to,
      status,
      priority,
      due_date,
      associated_milestone_id,
    } = body;

    if (!task_description) {
      return NextResponse.json(
        { success: false, error: 'Task description is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO tasks (
        task_description, task_details, assigned_to, created_by, status, priority, 
        due_date, associated_milestone_id, creation_date, last_updated_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *`,
      [
        task_description,
        task_details,
        assigned_to || null,
        authResult.user.userId,
        status || 'todo',
        priority || 'medium',
        due_date || null,
        associated_milestone_id || null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Task created successfully',
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}