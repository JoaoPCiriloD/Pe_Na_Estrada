import app from './app';
import { PORT } from './config';

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function shutdown() {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);