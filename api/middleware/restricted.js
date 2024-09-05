const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../../config')
 /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
const restricted = (req, res, next) => {
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer <token>"
  const token = req.headers.authorization
  console.log('header', req.headers)
  console.log('token', token)

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'token invalid' })
      } else {
        req.token = decodedToken
        console.log('decoded token', decodedToken)
        next()
      }
    })
  } else {
    res.status(401).json({ message: 'token required' })
  }
}

module.exports = restricted
