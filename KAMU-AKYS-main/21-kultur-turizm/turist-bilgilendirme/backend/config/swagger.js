import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Turist Bilgilendirme API',
      version: '1.0.0',
      description: 'Turist Bilgilendirme Sistemi Backend API Dokümantasyonu',
      contact: {
        name: 'Kamu AKYS',
        email: 'info@kamu-akys.gov.tr',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './server.js'],
};

const specs = swaggerJsdoc(options);
export default specs;
