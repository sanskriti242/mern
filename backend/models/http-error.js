class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); //add a message property
    this.code = errorCode; //adds a code property to instances based on this class
  }
}

module.exports = HttpError;
