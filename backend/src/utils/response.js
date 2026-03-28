/**
 * Send a standardized success response.
 */
export const successRes = (res, status, message, data = null, meta = null) => {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
};

/**
 * Send a standardized error response.
 */
export const errorRes = (res, status, message, err = null) => {
  const body = { success: false, message };
  if (process.env.NODE_ENV === 'development' && err) {
    body.error = err.message;
  }
  return res.status(status).json(body);
};
