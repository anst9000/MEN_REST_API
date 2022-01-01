const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 4,
    max: 100
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
})


module.exports = mongoose.model("user", userSchema)