module.exports = class DatabaseError extends Error {

  serve() {
    return {
      message: this.message,
    };
  }

}