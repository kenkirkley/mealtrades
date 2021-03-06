const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');

const offerSchema = new mongoose.Schema(
  {
    creator: Array,
    consumer: Array,
    description: {
      type: String,
      trim: true,
      required: [true, 'Your offer needs a description.']
    },
    // GEO JSON or just name? for now, name.
    location: {
      type: String
    },

    time: {
      type: Date
    }
  },
  { versionKey: false, autoIndex: false }
);
// EMBEDDING CREATOR
/////// CODE REVIEW //////////////////
// RIGHT NOW THIS USES REFERENCING. EVEN THOUGH IT IS A ONE TO ONE

// ALSO, CHECK IF THE USER INFO UPDATES CORRECTLY
// offerSchema.pre('save', async function(next) {
//   const creator = await User.findById(this.creator).select(
//     '-__v -passwordChangedAt'
//   );
//   this.creator = creator;
//   next();
// });

offerSchema.pre('save', async function(next) {
  const creatorPromise = this.creator.map(
    async id => await User.findById(id, 'name _id photo phoneNumber email')
  );
  this.creator = await Promise.all(creatorPromise);
  if (this.consumer) {
    const consumerPromise = this.consumer.map(
      async id => await User.findById(id, 'name _id photo phoneNumber email')
    );
    this.consumer = await Promise.all(consumerPromise);
  }

  next();
});

// This is to store dates as strings and not date objects. Instead, dates will be stored as Date objects and converted to string using toLocaleDateString on the presentation layer.
// offerSchema.pre('save', function(next) {
//   const options = {
//     weekday: 'long',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric'
//   };
//   const date = new Date(this.time);
//   this.time = date.toLocaleDateString(undefined, options);
//   next();
// });
// TIMEZONES: LOOK IN TO THIS: new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
