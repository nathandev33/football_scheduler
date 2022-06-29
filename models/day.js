const mongoose = require("mongoose");
const { Schema } = mongoose;

const daySchema = new Schema({
  monday: {
    type: [{ hrac: String, note: String }],
  },
  tuesday: {
    type: [{ hrac: String, note: String }],
  },
  wednesday: {
    type: [{ hrac: String, note: String }],
  },
  thursday: {
    type: [{ hrac: String, note: String }],
  },
  friday: {
    type: [{ hrac: String, note: String }],
  },
  saturday: {
    type: [{ hrac: String, note: String }],
  },
  sunday: {
    type: [{ hrac: String, note: String }],
  },
});

const Day = mongoose.model("Day", daySchema);
module.exports = Day;
