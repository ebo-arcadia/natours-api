const app = require('./app');

port = 3001;
app.listen(port, () => {
  console.info(`server is listening on ${port}`);
});
