const Users = require('../auth/auth-model')

const checkUsername = async (req, res, next) => {
    try {
        const [user] = await Users.findBy({ username: req.body.username })
        if (user) {
          next({ status: 422, message: "username taken" })
        } else {
          next()
        }
      } catch (err) {
        next(err)
      }
}

const checkUsernamePass = async (req, res, next) => {
  try {
    const [user] = await Users.findBy({ username: req.body.username })
    if (user) {
      next()
    } else {
      next({ status: 422, message: 'Invalid Credentials' })
    }
  } catch (err) {
    next(err)
  }
}

const validate = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json({ status: 401, message: "username and password required" })
  } 
}



module.exports = {
    checkUsername,
    checkUsernamePass,
    validate
}