import { Router } from 'express';
import {
  listExpenses,
  createExpense,
  deleteExpense,
  getSummary,
} from '../controllers/expenseController';

const router = Router();

/**
 * @openapi
 * /expenses:
 *   get:
 *     summary: List all expenses
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Food, Transport, Shopping, Utilities, Health, Entertainment]
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Array of expenses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseListResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get('/', listExpenses);

/**
 * @openapi
 * /expenses/summary:
 *   get:
 *     summary: Get expense summary statistics
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Food, Transport, Shopping, Utilities, Health, Entertainment]
 *         description: Filter summary by category
 *     responses:
 *       200:
 *         description: Summary statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SummaryResponse'
 */
router.get('/summary', getSummary);

/**
 * @openapi
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExpenseBody'
 *     responses:
 *       201:
 *         description: Created expense
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/', createExpense);

/**
 * @openapi
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense by ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense ID
 *     responses:
 *       200:
 *         description: Deletion confirmation
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', deleteExpense);

export default router;
