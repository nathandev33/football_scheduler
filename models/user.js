const mongoose = require('mongoose')
const { Schema } = mongoose

const kidSchema = new Schema({
  username: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  verifiedEmail: {
    type: String,
    default: 'pending',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  day: {
    type: String,
  },
  note: {
    type: String,
  },
  vek: {
    type: String,
  },
  // monday: {
  //   type: [String],
  // },
  // tuesday: {
  //   type: [String],
  // },
})

const Kid = mongoose.model('Kid', kidSchema)
module.exports = Kid
