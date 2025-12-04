const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  console.error("Error:", err);

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errorHandler;
