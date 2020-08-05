const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Motorista API',
      version: '1.0.0',
      description: 'Motorista api doc',
    },
  },
  apis: ['/motorista/public/api/routes*.js']
};

const specs = swaggerJsdoc(options);

module.exports=(app)=>{
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
