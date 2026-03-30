import app from './app';
import { env } from './config/env';

import { initCronJobs } from './services/cron.service';

const startServer = async () => {
    try {
        initCronJobs();
        app.listen(env.PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
            console.log(`🩺 Health check: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
