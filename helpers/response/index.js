/* ---- Methods ---- */

// OK

exports.success = (res, message) => {
  return sendResponse(res, 'ok', 200, message)
}

// Error

exports.simpleError = (res, statusCode, message) => {
  return sendResponse(res, 'error', statusCode, message)
}

/* ---- Aux Functions ---- */

function sendResponse (res, status, statusCode, body) {
  res
    .status(statusCode)
    .json({ status, statusCode, body })
}
