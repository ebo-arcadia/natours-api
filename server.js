const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((connection) => {
    console.info(connection.connections);
    console.info('DB connected successfully');
  });

const app = require('./app');

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.info(`server is listening on ${port}`);
});
