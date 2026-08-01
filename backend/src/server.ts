import app from './app';
import { PORT } from './config/constants';

app.listen(PORT, () => {
  console.info(`Smart Expense Tracker API running on http://localhost:${PORT}`);
  console.info(`Swagger documentation available at http://localhost:${PORT}/docs`);
});
