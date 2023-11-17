const Tour = require('../models/tourModel');

exports.checkDataBody = (request, response, next) => {
  if (!request.body.name || !request.body.price) {
    return response.status(400).json({
      status: 'fail',
      message: 'name and price property are missing',
    });
  }
  next();
};

exports.getAllTours = (request, response) => {
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestedAt,
    tourCount: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTourById = (request, response) => {
  const id = request.params.id * 1;
  const tour = tours.find((item) => item.id === id);

  if (!tour) {
    return response.status(404).json({ status: 'fail', message: 'invalid ID' });
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
exports.createATour = (request, response) => {
  response.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
};

exports.updateTour = (request, response) => {
  response.status(200).json({
    status: 'patch success',
    data: {
      tour: 'tour is updated...',
    },
  });
};
exports.deleteTour = (request, response) => {
  response.status(204).json({
    status: 'delete success',
    data: null,
  });
};
