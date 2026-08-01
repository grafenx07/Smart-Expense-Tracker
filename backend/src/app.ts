import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { CORS_ORIGINS } from './config/constants';
import expenseRoutes from './routes/expenseRoutes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { swaggerSpec } from './docs/swagger';

const app = express();

app.use(cors({ origin: CORS_ORIGINS, credentials: false }));
app.use(express.json());
app.use(requestLogger);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/expenses', expenseRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'The requested endpoint does not exist.' },
  });
});

app.use(errorHandler);

export default app;
