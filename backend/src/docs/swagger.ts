import swaggerJsdoc from 'swagger-jsdoc';
import { CATEGORIES } from '../types';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Smart Expense Tracker API',
      version: '1.0.0',
      description:
        'REST API for managing personal expenses. Provides CRUD operations and summary analytics.',
      contact: {
        name: 'Smart Expense Tracker',
      },
    },
    servers: [{ url: 'http://localhost:3001', description: 'Development server' }],
    tags: [{ name: 'Expenses', description: 'Expense management endpoints' }],
    components: {
      schemas: {
        Expense: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'V1StGXR8_Z5jdHi6B-myT' },
            title: { type: 'string', example: 'Coffee' },
            amount: { type: 'number', example: 188 },
            category: { type: 'string', enum: CATEGORIES, example: 'Food' },
            date: { type: 'string', format: 'date', example: '2026-07-28' },
            note: { type: 'string', example: 'Morning espresso at Blue Tokai' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateExpenseBody: {
          type: 'object',
          required: ['title', 'amount', 'category', 'date'],
          properties: {
            title: { type: 'string', maxLength: 40, example: 'Coffee' },
            amount: { type: 'number', minimum: 0.01, example: 188 },
            category: { type: 'string', enum: CATEGORIES, example: 'Food' },
            date: { type: 'string', format: 'date', example: '2026-07-28' },
            note: { type: 'string', maxLength: 165, example: 'Morning espresso at Blue Tokai' },
          },
        },
        ExpenseResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Expense' },
          },
        },
        ExpenseListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { $ref: '#/components/schemas/Expense' } },
          },
        },
        SummaryResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 9113 },
                average: { type: 'number', example: 911.3 },
                count: { type: 'integer', example: 10 },
                highest: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    amount: { type: 'number' },
                  },
                },
                highestCategory: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    name: { type: 'string' },
                    total: { type: 'number' },
                  },
                },
                byCategory: {
                  type: 'object',
                  additionalProperties: { type: 'number' },
                },
                monthlyTrend: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      month: { type: 'string', example: 'Jul 2026' },
                      total: { type: 'number', example: 9113 },
                    },
                  },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Title is required.' },
              },
            },
          },
        },
      },
      responses: {
        ValidationError: {
          description: 'Invalid request data',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
