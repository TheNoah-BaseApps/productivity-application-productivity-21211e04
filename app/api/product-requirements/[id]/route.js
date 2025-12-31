import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/product-requirements/{id}:
 *   get:
 *     summary: Get a specific product requirement
 *     description: Retrieve details of a single product requirement by ID
 *     tags: [Product Requirements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product requirement retrieved successfully
 *       404:
 *         description: Product requirement not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'SELECT * FROM product_requirements WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product requirement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching product requirement:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/product-requirements/{id}:
 *   put:
 *     summary: Update a product requirement
 *     description: Update an existing product requirement
 *     tags: [Product Requirements]
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
 *               requirement_id:
 *                 type: string
 *               customer_id:
 *                 type: string
 *               document_source:
 *                 type: string
 *               feature_description:
 *                 type: string
 *               priority:
 *                 type: string
 *               associated_product:
 *                 type: string
 *               requirement_date:
 *                 type: string
 *               status:
 *                 type: string
 *               no_of_sprints:
 *                 type: integer
 *               cost:
 *                 type: integer
 *               q_cparameters:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product requirement updated successfully
 *       404:
 *         description: Product requirement not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      requirement_id,
      customer_id,
      document_source,
      feature_description,
      priority,
      associated_product,
      requirement_date,
      status,
      no_of_sprints,
      cost,
      q_cparameters
    } = body;

    const result = await query(
      `UPDATE product_requirements 
       SET requirement_id = COALESCE($1, requirement_id),
           customer_id = COALESCE($2, customer_id),
           document_source = COALESCE($3, document_source),
           feature_description = COALESCE($4, feature_description),
           priority = COALESCE($5, priority),
           associated_product = COALESCE($6, associated_product),
           requirement_date = COALESCE($7, requirement_date),
           status = COALESCE($8, status),
           no_of_sprints = COALESCE($9, no_of_sprints),
           cost = COALESCE($10, cost),
           q_cparameters = COALESCE($11, q_cparameters),
           updated_at = NOW()
       WHERE id = $12
       RETURNING *`,
      [
        requirement_id,
        customer_id,
        document_source,
        feature_description,
        priority,
        associated_product,
        requirement_date,
        status,
        no_of_sprints,
        cost,
        q_cparameters,
        id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product requirement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating product requirement:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/product-requirements/{id}:
 *   delete:
 *     summary: Delete a product requirement
 *     description: Remove a product requirement from the database
 *     tags: [Product Requirements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product requirement deleted successfully
 *       404:
 *         description: Product requirement not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'DELETE FROM product_requirements WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product requirement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product requirement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product requirement:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}