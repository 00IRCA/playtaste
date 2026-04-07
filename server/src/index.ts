import 'dotenv/config';
import { env } from './env';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = env.PORT;

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
