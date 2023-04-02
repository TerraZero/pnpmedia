const DatabaseError = require('./DatabaseError');

module.exports = class DBFieldError extends DatabaseError {

  constructor(message, title, field) {
    super(message);
    this._title = title;
    this._field = field;
  }

  serve() {
    return {
      message: this.message,
      title: this._title,
      field: this._field,
    };
  }

}