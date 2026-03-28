export const notFound = (req, res) => {
  res
    .status(404)
    .json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
};

export const globalError = (err, req, res, _next) => {
  console.error('[GlobalError]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
