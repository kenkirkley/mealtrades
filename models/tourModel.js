const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    // schema type options
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});
// use mongoose.model() with the schema u made
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
