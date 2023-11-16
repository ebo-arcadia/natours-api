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
  .then(() => {
    console.info('DB connected successfully');
  });

const app = require('./app');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 1.0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const tourObj = new Tour({
  name: 'Moscow',
  rating: 2.1,
  price: 180,
});

tourObj
  .save()
  .then((doc) => {
    console.info(doc);
  })
  .catch((err) => {
    console.warn('error😾', err);
  });

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.info(`server is listening on ${port}`);
});
