const Tour = require('../models/tourModel');
const TourAPI = require('../utilities/tourAPI');
const catchAsync = require('../utilities/catchAsync');
const TourError = require('../utilities/tourError');

// get top 5 tour middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const tourAPIInstance = new TourAPI(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const tours = await tourAPIInstance.query;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedAt,
    tourCount: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new TourError('no tour is found with the given id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createATour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new TourError('no tour is found with the given id', 404));
  }
  res.status(200).json({
    status: 'patch success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new TourError('no tour is found with the given id', 404));
  }
  res.status(204).json({
    status: 'this tour is now deleted',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const monthlyPlan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);
  res.status(204).json({
    status: 'success',
    data: {
      monthlyPlan,
    },
  });
});
