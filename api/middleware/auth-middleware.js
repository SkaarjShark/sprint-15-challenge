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



module.exports = {
    checkUsername
}