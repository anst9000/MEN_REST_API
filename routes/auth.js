const router = require('express').Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const { registerValidation, loginValidation } = require('../auth/validation')


// Registration
// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  // validate the user input
  const { error } = registerValidation(req.body)

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    })
  }

  // check if the email is already registered
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) {
    return res.status(400).json({
      success: false,
      error: `ERROR: Email already exists`
    })
  }

  // hash the password
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(req.body.password, salt)

  // create a user object and save in the DB
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password
  });

  try {
    const savedUser = await newUser.save()
    res.json({
      success: true,
      error: null,
      data: {
        id: savedUser._id
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    })
  }
});



// Login
// @desc    Log in user
// @route   POST /api/users/login
// @access  Private
router.post('/login', async (req, res) => {
  // validate user login info
  const { error } = loginValidation(req.body)

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    })
  }

  // if login info is valid, find the user
  const user = await User.findOne({ email: req.body.email })

  // throw error if email is wrong (user does not exist in DB)
  if (!user) {
    return res.status(400).json({
      success: false,
      error: `ERROR: Email is wrong`
    })
  }

  // user exists - check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password)

  // throw error if password is wrong
  if (!validPassword) {
    return res.status(400).json({
      success: false,
      error: `ERROR: Password is wrong`
    })
  }

  // create authentication token with username and id
  const token = jwt.sign(
    // Payload
    {
      name: user.name,
      id: user._id
    },
    // Token secret
    process.env.TOKEN_SECRET,
    // Expiration time
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  )


  // attach auth token to header
  res.header("auth-token", token).json({
    success: true,
    error: null,
    data: {
      token
    }
  });
});



module.exports = router