const Offer = require('../models/offerModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError.js');
const factory = require('./handlerFactory');

exports.getAllOffers = factory.getAll(Offer);
exports.getOffer = factory.getOne(Offer, { path: 'creator' });
exports.createOffer = factory.createOne(Offer);
exports.updateOffer = factory.updateOne(Offer);
exports.deleteOffer = factory.deleteOne(Offer);
