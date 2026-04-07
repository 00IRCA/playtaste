import 'dotenv/config';
import 'express-async-errors';
import { env } from './env';
import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = env.PORT;

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

app.use('/api/health', healthRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
