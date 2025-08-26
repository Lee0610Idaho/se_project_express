const errorHandler = (err, req, res, next) => {
  console.error("ERROR: ", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ message });
};

module.exports = errorHandler;
