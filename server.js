const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewURLParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection successful');
  });

// make a schema
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

const testTour = new Tour({
  name: 'The Park Camper',
  price: 497
});

testTour
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => console.log('ERROR', err));

////////////////////////////////
// SERVER START
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
