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

  // Need to make a confirmation link with the offer and consumer as params. Create the link, then pass it to the send message function in message controller.
  // ${req.protocol}://${req.get('host')}/offers/confirm/offer/:offerid/consumer/:consumer
  // HERE INSTEAD :offerid and :consumer put the id and consumer user id in this link. Put this message in text. Also make this route.
  // use doc to access the offer.

  // desired text message content
  // text = Somebody has expressed interest in your offer! Click this link to see who it is and confirm/deny their request

  await messageController.sendText(
    creator.phoneNumber,
    'Somebody has expressed interest in your offer! Click this link to see who it is and confirm/deny their request.'
  );

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

exports.confirmOffer = catchAsync(async (req, res, next) => {
  const offer = await Offer.findById(req.params.offerid);
  const consumer = await User.findById(req.params.consumerid);

  if (!offer || !consumer) {
    return next(new AppError('No document found with that ID', 404));
  }

  // This method happens when the creator accepts the consumption request. Upon doing so, the creator's phone number will be given to the consumer.

  // if statement: if accept, send one text, if deny, send another. To track answer, add another parameter accept with accept or deny fields. Or just two different routes.
  if (req.params.confirmation === 'confirm') {
    await messageController.sendText(
      consumer.phoneNumber,
      `${offer.creator[0].name} has accepted your request! You can get in contact with them at this phone number: ${offer.creator[0].phoneNumber}`
    );
  } else {
    await messageController.sendText(
      consumer.phoneNumber,
      `${offer.creator[0].name} is not able to fulfil your request. You can look for more listings on our main page.`
    );
  }

  res.status(200).json({
    // JSend specs
    status: 'Sucess',
    data: {}
  });
});
