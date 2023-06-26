const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser');

const {PORT = 3000} = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
.then(() => {
  console.log('connected to db');
});

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '649814a3354441ec8ab3f73d' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(bodyParser.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})