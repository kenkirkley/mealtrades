const Offer = require('../models/offerModel');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError.js');
const factory = require('./handlerFactory');
const Nexmo = require('nexmo');

exports.getAllOffers = factory.getAll(Offer);
exports.getOffer = factory.getOne(Offer);
exports.createOffer = factory.createOne(Offer, { attachCreator: true });
exports.updateOffer = factory.updateOne(Offer);
exports.deleteOffer = factory.deleteOne(Offer);

exports.consumeOffer = catchAsync(async (req, res, next) => {
  // 1) Obtain offer and creator details
  const query = Offer.findById(req.params.id);
  // populate may have an impact on performance
  const doc = await query;

  const creatorQuery = User.findById(
    doc.creator[0]._id,
    '-__v -passwordChangedAt -role'
  );
  const creator = await creatorQuery;

  // At this point you have access to the offer and the creator.
  // 2) Verify Documents
  if (!doc || !creator) {
    return next(new AppError('No document found with that ID', 404));
  }
  // 3) Send confirmation link to creator
  const nexmo = new Nexmo({
    apiKey: '975a39c3',
    apiSecret: 'tt951SvmdYp2Pm94'
  });

  const from = process.env.NEXMO_VIRTUAL_NUMBER;
  // number from creator document
  const to = '18322170123';
  // desired text message content
  const text = 'test message dank.';

  nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]['status'] !== '0') {
        console.log(
          `Message failed with error: ${responseData.messages[0]['error-text']}`
        );
      }
      console.log('Message sent successfully.');
    }
  });

  // 4) When creator clicks link, notify user of confirmation/deny. Need new route
  res.status(200).json({
    // JSend specs
    status: 'Sucess',
    data: {
      data: doc,
      creator
    }
  });
});
