/**
 * @swagger
 * /api/dashboard/metrics:
 *   get:
 *     summary: Get dashboard metrics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metrics retrieved successfully
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

    const userId = authResult.user.userId;
    const userRole = authResult.user.role;

    // Get task metrics
    let taskQuery = 'SELECT COUNT(*) as total, status FROM tasks';
    const taskParams = [];
    
    if (userRole === 'employee') {
      taskQuery += ' WHERE assigned_to = $1';
      taskParams.push(userId);
    }
    
    taskQuery += ' GROUP BY status';

    const tasksResult = await query(taskQuery, taskParams);

    const taskMetrics = {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      todoTasks: 0,
      blockedTasks: 0,
    };

    tasksResult.rows.forEach(row => {
      taskMetrics.totalTasks += parseInt(row.total);
      if (row.status === 'completed') taskMetrics.completedTasks = parseInt(row.total);
      if (row.status === 'in_progress') taskMetrics.inProgressTasks = parseInt(row.total);
      if (row.status === 'todo') taskMetrics.todoTasks = parseInt(row.total);
      if (row.status === 'blocked') taskMetrics.blockedTasks = parseInt(row.total);
    });

    // Get overdue tasks
    let overdueQuery = 'SELECT COUNT(*) as count FROM tasks WHERE due_date < CURRENT_DATE AND status != $1';
    const overdueParams = ['completed'];
    
    if (userRole === 'employee') {
      overdueQuery += ' AND assigned_to = $2';
      overdueParams.push(userId);
    }

    const overdueResult = await query(overdueQuery, overdueParams);
    const overdueTasks = parseInt(overdueResult.rows[0]?.count || 0);

    // Get leave metrics
    let leaveQuery = 'SELECT COUNT(*) as total, approval_status FROM leaves';
    const leaveParams = [];
    
    if (userRole === 'employee') {
      leaveQuery += ' WHERE employee_id = $1';
      leaveParams.push(userId);
    }
    
    leaveQuery += ' GROUP BY approval_status';

    const leavesResult = await query(leaveQuery, leaveParams);

    const leaveMetrics = {
      totalLeaves: 0,
      pendingLeaves: 0,
      approvedLeaves: 0,
      rejectedLeaves: 0,
    };

    leavesResult.rows.forEach(row => {
      leaveMetrics.totalLeaves += parseInt(row.total);
      if (row.approval_status === 'pending') leaveMetrics.pendingLeaves = parseInt(row.total);
      if (row.approval_status === 'approved') leaveMetrics.approvedLeaves = parseInt(row.total);
      if (row.approval_status === 'rejected') leaveMetrics.rejectedLeaves = parseInt(row.total);
    });

    // Get workload distribution (managers/admins only)
    let workloadDistribution = [];
    if (userRole !== 'employee') {
      const workloadResult = await query(
        `SELECT u.name, u.id, COUNT(t.task_id) as task_count
         FROM users u
         LEFT JOIN tasks t ON u.id = t.assigned_to AND t.status != 'completed'
         GROUP BY u.id, u.name
         ORDER BY task_count DESC
         LIMIT 10`
      );

      workloadDistribution = workloadResult.rows.map(row => ({
        name: row.name,
        taskCount: parseInt(row.task_count),
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        ...taskMetrics,
        ...leaveMetrics,
        overdueTasks,
        workloadDistribution,
      },
    });
  } catch (error) {
    console.error('Get metrics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}