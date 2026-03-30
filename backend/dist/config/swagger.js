"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("./env");
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NSM Swimming Academy API',
            version: '1.0.0',
            description: 'API Documentation for NSM Swimming Academy Backend'
        },
        servers: [
            {
                url: `http://localhost:${env_1.env.PORT}${env_1.env.API_PREFIX}`,
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
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
