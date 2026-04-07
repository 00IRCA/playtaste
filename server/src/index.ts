import 'dotenv/config';
import 'express-async-errors';
import { env } from './env';
import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health';

const app = express();
const PORT = env.PORT;

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

app.use('/api/health', healthRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
