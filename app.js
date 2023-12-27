const express = require('express');
const morgan = require('morgan');
const responseTime = require('response-time');
const StatsD = require('node-statsd');

const tourRouter = require('./routes/tourRouters');
const userRouter = require('./routes/userRouters');
const { error } = require('automake');

const app = express();
const stats = new StatsD();

stats.socket.on('error', (error) => {
  console.error(error.stack);
});
// middleware
// can only be invoked during the request & response lifecycle
app.use(responseTime());
console.info('current env:', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((request, response, next) => {
  request.requestedAt = new Date().toISOString();
  next();
});
app.use(
  responseTime(function (req, res, time) {
    const stat = (req.method + req.url)
      .toLowerCase()
      .replace(/[:.]/g, '')
      .replace(/\//g, '_');
    stats.timing(stat, time);
  }),
);

// use router as middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'failed to fetch',
    message: `endpoint ${req.originalUrl} does not exist.`,
  });
});

module.exports = app;
