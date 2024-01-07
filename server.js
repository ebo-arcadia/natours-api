const mongoose = require('mongoose');
const dotenv = require('dotenv');

// handle unexpected caught errors
process.on(`uncaughtException`, (uncaughtException) => {
  console.error(uncaughtException.name, uncaughtException.message);
  console.error(
    'unexpected exception caught occurred!👁️ shutting down server...',
  );
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

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
  .then(() => {
    console.info('DB connected successfully');
  });

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.info(`server is listening on ${port}`);
});

process.on('unhandledRejection', (unhandledServerError) => {
  console.error(unhandledServerError.name, unhandledServerError.message);
  console.error(
    'Unhandled server rejection occurred!👁️ shutting down server...',
  );
  server.close(() => {
    process.exit(1);
  });
});
