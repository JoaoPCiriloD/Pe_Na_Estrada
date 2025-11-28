import express from 'express';
import prisma from './prisma';
import uploadsRouter from './router/uploads';

const app = express();

app.use(express.json());

app.get('/health', async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return res.json({ ok: true });
    } catch (err) {
        return res.status(500).json({ ok: false, error: String(err) });
    }
});

app.use('/api/uploads', uploadsRouter);

export default app;