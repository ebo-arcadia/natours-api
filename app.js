const express = require('express');
const fileSys = require('fs');

const app = express();
app.use(express.json());

const tours = JSON.parse(fileSys.readFileSync(`${__dirname}/data/tours.json`));

app.get('/', (request, response) => {
  console.info('request data: ', request);
  response
    .status(200)
    .json({ message: 'Hello from Natours API!', application: 'Natours api' });
});

app.get('/api/v1/tours', (request, response) => {
  console.info(request.url);
  response.status(200).json({
    status: 'success',
    tourCount: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (request, response) => {
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
});

app.post('/api/v1/tours', (request, response) => {
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
});

app.patch('/api/v1/tours/:id', (request, response) => {
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
});

port = 3001;
app.listen(port, () => {
  console.info(`server is listening on ${port}`);
});
