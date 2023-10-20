const express = require('express');
const fileSys = require('fs');
const morgan = require('morgan');
const responseTime = require('response-time');
const StatsD = require('node-statsd');

const app = express();
let stats = new StatsD();

stats.socket.on('error', function (error) {
  console.error(error.stack);
});
// middleware
// can only be invoked during the request & response lifecycle
app.use(responseTime());
app.use(morgan('combined'));
app.use(express.json());
app.use((request, response, next) => {
  request.requestedAt = new Date().toISOString();
  next();
});
app.use(
  responseTime(function (req, res, time) {
    var stat = (req.method + req.url)
      .toLowerCase()
      .replace(/[:.]/g, '')
      .replace(/\//g, '_');
    stats.timing(stat, time);
  })
);

const tours = JSON.parse(fileSys.readFileSync(`${__dirname}/data/tours.json`));

// route header
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
const getAllUsers = (request, response) => {
  response.status(200).json({
    status: 'success',
    data: null,
  });
};
const createUser = (request, response) => {
  response.status(200).json({
    status: 'success',
    data: null,
  });
};
const getUser = (request, response) => {
  response.status(200).json({
    status: 'success',
    data: null,
  });
};
const updateUser = (request, response) => {
  response.status(200).json({
    status: 'success',
    data: null,
  });
};
const deleteUser = (request, response) => {
  response.status(200).json({
    status: 'success',
    data: null,
  });
};

// routes

app.route('/api/v1/tours').get(getAllTours).post(createATour);
app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// server
port = 3001;
app.listen(port, () => {
  console.info(`server is listening on ${port}`);
});
