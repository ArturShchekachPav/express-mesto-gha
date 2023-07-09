const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

const limiter = rateLimit({
  max: 200,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP',
});

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(routes);
app.use((err, req, red, next) => {
  res.send({message: err.message})
})

app.listen(PORT);
