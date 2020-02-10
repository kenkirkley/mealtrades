const Offer = require('../models/offerModel');
const User = require('../models/userModel');
const messageController = require('./messageController');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError.js');
const factory = require('./handlerFactory');

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

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // Separate sending message into message creator
  const to = creator.phoneNumber;

  // Need to make a confirmation link with the offer and consumer as params. Create the link, then pass it to the send message function in message controller.
  // ${req.protocol}://${req.get('host')}/offers/confirm/offer/:offerid/consumer/:consumer
  // HERE INSTEAD :offerid and :consumer put the id and consumer user id in this link. Put this message in text. Also make this route.
  // use doc to access the offer.

  // desired text message content
  // text = Somebody has expressed interest in your offer! Click this link to see who it is and confirm/deny their request
  const text = 'test message dank.';

  await messageController.sendText(to, text);

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
