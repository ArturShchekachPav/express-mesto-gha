class NotFoundError extends Error {
  constructor(message) {
  super(error);
  this.statusCode = 404;
  }
}

module.exports = NotFoundError;