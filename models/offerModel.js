const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');
const userSchema = require('./userModel').schema;

const offerSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.ObjectId, ref: 'User' },
  description: {
    type: String,
    trim: true
  },
  // GEO JSON or just name? for now, name.
  location: {
    type: String,
    require: true
  },
  time: {
    type: Date,
    required: true
  }
});
// EMBEDDING CREATOR
/////// CODE REVIEW //////////////////
// RIGHT NOW THIS USES REFERENCING. EVEN THOUGH IT IS A ONE TO ONE

// ALSO, CHECK IF THE USER INFO UPDATES CORRECTLY
offerSchema.pre('save', async function(next) {
  const creator = await User.findById(this.creator).select(
    '-__v -passwordChangedAt'
  );
  this.creator = creator;
  next();
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
