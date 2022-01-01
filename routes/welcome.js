const router = require('express').Router()

// @desc    CrGet welcome message
// @route   GET /api/welcome
// @access  Public
router.get('/', (req, res) => {
  res.status(200).send({
    success: true,
    message: "Welcome to the MEN RESTful API"
  })
})


module.exports = router