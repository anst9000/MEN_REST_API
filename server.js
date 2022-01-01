const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const colors = require('colors');
const morgan = require('morgan');

// Swagger dependencies
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs');

const welcomeRoutes = require('./routes/welcome')
const productRoutes = require('./routes/product')
const authRoutes = require('./routes/auth')

const PORT = process.env.PORT || 4000

require('dotenv-flow').config();
// Parse requset of content-type JSON

const app = express()
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Set up Swagger
const swaggerDefinition = yaml.load('./config/swagger.yaml')
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition))

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).catch(err => console.error(`ERROR: Problem connecting to MongoDB => ${err}`))

mongoose.connection.once('open', () => {
  console.log('Connected successfully to MongoDB')
})

// Routes
app.use('/api/welcome', welcomeRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', authRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})

module.exports = app;