const router = require('express').Router()
const product = require('../models/product')
const { verifyToken } = require('../auth/validation')


// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', (req, res) => {
  product.find({})
    .then(data => {
      data.success = true
      res.send(data)
    })
    .catch(err => { res.status(500).send({ success: false, message: err.message })})
})


// @desc    Get all products in stock
// @route   GET /api/products
// @access  Public
router.get('/instock', (req, res) => {
  product.find({ inStock: true })
    .then(data => {
      data.success = true
      res.send(data)
    })
    .catch(err => { res.status(500).send({ success: false, message: err.message })})
})


// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', (req, res) => {
  product.findById(req.params.id)
    .then(data => {
      data.success = true
      res.send(data)
    })
    .catch(err => { res.status(500).send({ success: false, message: err.message })})
})


// @desc    Create new  product
// @route   POST /api/products
// @access  Private
router.post('/', verifyToken, (req, res) => {
  data = req.body

  product.insertMany(data)
    .then(data => {
      data.success = true
      res.send(data)
    })
    .catch(err => { res.status(500).send({ success: false, message: err.message })})
})


// @desc    Update single product
// @route   PUT /api/products/:id
// @access  Private
router.put('/:id', verifyToken, (req, res) => {
  const id = req.params.id

  product.findByIdAndUpdate(id, req.body)
    .then(data => {
      if (!data) {
        res.status(404).send({
          success: false,
          message: `Can not update product with id ${id}`
        })
      } else {
        res.status(200).send({
          success: true,
          message: `Product with id ${id} was updated`
        })
      }
    })
    .catch(err => { res.status(500).send({ success: false, message: `ERROR: Problem updating product with id ${id}. ${err.message}` })})
})


// @desc    Delete single product
// @route   DELETE /api/products/:id
// @access  Private
router.delete('/:id', verifyToken, (req, res) => {
  const id = req.params.id

  product.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          success: false,
          message: `Can not delete product with id ${id}`
        })
      } else {
        res.status(200).send({
          success: true,
          message: `Product with id ${id} was deleted`
        })
      }
    })
    .catch(err => { res.status(500).send({ success: false, message: `ERROR: Problem deleting product with id ${id}. ${err.message}` })})
})


module.exports = router
