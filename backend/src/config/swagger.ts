import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NSM Swimming Academy API',
            version: '1.0.0',
            description: 'API Documentation for NSM Swimming Academy Backend'
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
                description: 'Development Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.controller.ts']
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
