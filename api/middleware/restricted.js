  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
const restricted = (req, res, next) => {
  if (req.session.user) {
    if (!req.session.user) {
      next({ status: 401, message: "token invalid" })
    } else {
      next()
    }
  } else {
    next({ status: 401, message: "token required" })
  }
}

module.exports = restricted
