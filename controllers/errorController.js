const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error!😾', err);
    res.status(500).json({
      status: 'error',
      message: 'unexpected error',
    });
  }
};

module.exports = (err, req, res, next) => {
  let error;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrProd(err, res);
  }
};
