const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// using virtual property to save space in DB
// useful when property can be easily converted by another
// virtual property is not saved in DB schema
tourSchema.virtual('durationWeeks').get(function callback() {
  return this.duration / 7;
});

// document middleware using pre hook to process query before persisting
tourSchema.pre('save', function callback(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', function callback(next) {
  console.info('new tour is staged.');
  next();
});

tourSchema.post('save', function callback(doc, next) {
  console.info(doc);
  console.info('tour persisted in DB success');
  next();
});

// query middleware to modify query before query is sent to DB
tourSchema.pre(/^find/, function callback(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function callback(doc, next) {
  console.info(`query took ${Date.now() - this.start} milliseconds...`);
  console.info(doc);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
