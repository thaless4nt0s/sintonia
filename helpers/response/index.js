/* ---- METHODS ---- */

// OK

exports.success = (res, message) => {
  return sendResponse(res, 'ok', 200, message)
}

// Error

exports.simpleError = (res, statusCode, message) => {
  return sendResponse(res, 'error', statusCode, message)
}

// SERVER ERROR

exports.serverError = (res) => {
  const statusCode = 500
  const message = 'Houve um erro interno. Por favor tente novamente mais tarde ou entre em contato com o suporte.'

  return sendResponse(res, 'error', statusCode, message)
}


/* ---- AUX FUNCTIONS ---- */

function sendResponse (res, status, statusCode, body) {
  res
    .status(statusCode)
    .json({ status, statusCode, body })
}
