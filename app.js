const express = require('express');
const fileSys = require('fs');

const app = express();

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

port = 3001;
app.listen(port, () => {
  console.info(`server is listening on ${port}`);
});
