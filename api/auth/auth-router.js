const router = require('express').Router();
const Users = require('./auth-model')
const { checkUsername, checkUsernamePass } = require('../middleware/auth-middleware')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../../config')

router.post('/register', checkUsername, async (req, res, next) => {
  let newUser = req.body
  console.log(newUser)
  if (!newUser.username || !newUser.password) {
    res.status(401).json({ status: 401, message: "username and password required" })
  } else {
    const hash = bcrypt.hashSync(newUser.password, 8) // 2 ^ n
    newUser.password = hash
    Users.add(newUser)
      .then(result => {
        res.json(result)
      })
      .catch(err => {
        res.json(err)
      })
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', checkUsernamePass, async (req, res) => {
  let {username, password} = req.body
  // if (!username || !password) {
  //   res.status(401).json({ status: 401, message: "username and password required" })
  // } else {
    console.log({username, password})
    Users.findBy({ username })
      .then(([user]) => {
        console.log('hi', user)
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user)
          req.header('Authorization', 'Bearer ' + token)
          res.status(200).json({
            message: `Welcome, ${user.username}`,
            token: token,
          })
        } else {
          res.status(401).json({ message: 'Invalid Credentials' })
        }
      })
      .catch(err => {
        res.status(500).json({ message: 'Server Error. Sorry!' })
      })
  // }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */  
});

const generateToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = router;
