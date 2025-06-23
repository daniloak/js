module.exports = (error, request, response, next) => {
  console.log('#### ERROR ####');
  response.sendStatus(500);
};
