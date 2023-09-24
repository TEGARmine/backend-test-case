const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swagger = require ('./swagger.json');
const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({
        message: "tes"
    })
})

require('./src/routes/BookRoutes')(app);
app.use('/api-docs-sum', swaggerUi.serve, swaggerUi.setup(swagger));

// Mulai server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});


module.exports = app;