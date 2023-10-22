const express = require('express');
const fileSys = require('fs');

const router = express.Router();

const tours = JSON.parse(
  fileSys.readFileSync(`${__dirname}/../data/tours.json`)
);

const getAllTours = (request, response) => {
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestedAt,
    tourCount: tours.length,
    data: {
      tours,
    },
  });
};
const getTourById = (request, response) => {
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
const createATour = (request, response) => {
  const newTourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newTourId }, request.body);

  tours.push(newTour);

  fileSys.writeFile(
    `${__dirname}/data/tours.json`,
    JSON.stringify(tours),
    () => {
      response.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
const updateTour = (request, response) => {
  if (request.params.id * 1 > tours.length) {
    return response.status(404).json({
      status: 'fail',
      message: 'invalid tour ID',
    });
  }
  response.status(200).json({
    status: 'patch success',
    data: {
      tour: 'tour is updated...',
    },
  });
};
const deleteTour = (request, response) => {
  if (request.params.id * 1 > tours.length) {
    return response.status(404).json({
      status: 'fail',
      message: 'invalid tour ID',
    });
  }
  response.status(204).json({
    status: 'delete success',
    data: null,
  });
};

router.route('/').get(getAllTours).post(createATour);
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
