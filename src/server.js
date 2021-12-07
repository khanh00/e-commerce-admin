const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = require('./app');

const uri = process.env.DB_URI;
const port = process.env.PORT;

mongoose.connect(uri).then(() => console.log('Database Connected!'));

const server = app.listen(port, () => console.log('App running...'));

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
