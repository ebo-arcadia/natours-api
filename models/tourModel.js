const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'a tour name can only have less than 50 characters'],
      minlength: [5, 'a tour name must contain at least 5 characters'],
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
      enum: {
        values: [
          'beginner',
          'easy',
          'sky-walker',
          'medium',
          'Jedi',
          'master',
          'difficult',
        ],
        message: 'value for difficulty is invalid. Refer to model.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0.5, 'rating must be above 0.5'],
      max: [5.0, 'rating can not above 5.0'],
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
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: 'discount ({VALUE}) can not be greater than the full price.',
      },
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
      validate: [validator.isDate, 'created at must be a date type'],
    },
    startDates: {
      type: Date,
      validate: [validator.isDate, 'start date must be a date type'],
    },
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
  next();
});

// aggregation middleware
tourSchema.pre('aggregate', function callback(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.info(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
