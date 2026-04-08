import 'dotenv/config';
import 'express-async-errors';
import { env } from './env';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = env.PORT;

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
