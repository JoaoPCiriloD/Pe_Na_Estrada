import { Router } from 'express';
import upload from '../middleware/multer';
import parseSpreadsheet from '../services/spreadsheetParser';
import prisma from '../prisma';
import path from 'path';

const router = Router();

// POST /api/uploads
// form-data: file=@arquivo.xlsx
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'file is required' });

        const filePath = path.resolve(req.file.path);

        // cria registro de upload (ajuste fields conforme seu schema Prisma)
        const uploadRecord = await prisma.upload.create({
            data: {
                userId: 'fake-user-id', // TODO: obter do JWT
                filename: req.file.originalname,
                path: req.file.path,
                status: 'processing',
            },
        });

        // parse
        const rows = await parseSpreadsheet(filePath);

        // cria reuniões a partir das linhas (exemplo simples)
        const createdMeetings: any[] = [];
        for (const [index, row] of rows.entries()) {
            // normalize / validate here (ex: date/time parsing)
            const meeting = await prisma.meeting.create({
                data: {
                    uploadId: uploadRecord.id,
                    lineNumber: index + 1,
                    title: row.title ?? row.Evento ?? `Linha ${index + 1}`,
                    rawData: row,
                    status: 'pending',
                },
            });
            createdMeetings.push(meeting);
        }

        await prisma.upload.update({
            where: { id: uploadRecord.id },
            data: { status: 'done' },
        });

        return res.json({ uploadId: uploadRecord.id, parsed: createdMeetings.length });
    } catch (err: unknown) {
        // se erro, tente atualizar registro de upload (se existir)
        // eslint-disable-next-line no-console
        console.error(err);
        return res.status(500).json({ error: String(err) });
    }
});

export default router;