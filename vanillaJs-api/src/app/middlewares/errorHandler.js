module.exports = (error, request, response, next) => {
  console.log('#### ERROR ####', error);
  response.sendStatus(500);
};
