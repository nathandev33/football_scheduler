const mongoose = require("mongoose");
const { Schema } = mongoose;

const daySchema = new Schema({
  monday: {
    type: [{ hrac: String, note: String }],
  },
  tuesday: {
    type: [String],
  },
  wednesday: {
    type: [String],
  },
  thursday: {
    type: [String],
  },
  friday: {
    type: [String],
  },
  saturday: {
    type: [String],
  },
  sunday: {
    type: [String],
  },
});

const Day = mongoose.model("Day", daySchema);
module.exports = Day;
