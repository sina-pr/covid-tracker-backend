//imports ...
const express = require('express');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config();

// apply middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Insert Routes
const countriesCountroller = require('./controller/countriesController');
const userController = require('./controller/usersController');

app.use('/countries', countriesCountroller);
app.use('/admin', userController);

//Connect to db
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log('Connected to database.')
);

app.get('/', (req, res) => {
  res.send('ok');
});

app.listen(3005, () => {
  console.log('Server is running.');
});
