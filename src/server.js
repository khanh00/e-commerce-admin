const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const app = require('./app');

const { DB_URI, PORT } = process.env;

mongoose.connect(DB_URI).then(() => console.log('Database Connected!'));

const server = app.listen(PORT, () => console.log('App running...'));

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
