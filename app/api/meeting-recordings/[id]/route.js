import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/meeting-recordings/{id}:
 *   get:
 *     summary: Get a specific meeting recording
 *     description: Retrieve details of a single meeting recording by ID
 *     tags: [Meeting Recordings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting recording ID
 *     responses:
 *       200:
 *         description: Meeting recording retrieved successfully
 *       404:
 *         description: Meeting recording not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'SELECT * FROM meeting_recordings WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Meeting recording not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching meeting recording:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/meeting-recordings/{id}:
 *   put:
 *     summary: Update a meeting recording
 *     description: Update an existing meeting recording
 *     tags: [Meeting Recordings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recording_id:
 *                 type: string
 *               meeting_title:
 *                 type: string
 *               participants:
 *                 type: string
 *               recording_link:
 *                 type: string
 *               meeting_date:
 *                 type: string
 *               duration:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Meeting recording updated successfully
 *       404:
 *         description: Meeting recording not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { recording_id, meeting_title, participants, recording_link, meeting_date, duration } = body;

    const result = await query(
      `UPDATE meeting_recordings 
       SET recording_id = COALESCE($1, recording_id),
           meeting_title = COALESCE($2, meeting_title),
           participants = COALESCE($3, participants),
           recording_link = COALESCE($4, recording_link),
           meeting_date = COALESCE($5, meeting_date),
           duration = COALESCE($6, duration),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [recording_id, meeting_title, participants, recording_link, meeting_date, duration, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Meeting recording not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating meeting recording:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/meeting-recordings/{id}:
 *   delete:
 *     summary: Delete a meeting recording
 *     description: Remove a meeting recording from the database
 *     tags: [Meeting Recordings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meeting recording deleted successfully
 *       404:
 *         description: Meeting recording not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'DELETE FROM meeting_recordings WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Meeting recording not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Meeting recording deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting meeting recording:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}