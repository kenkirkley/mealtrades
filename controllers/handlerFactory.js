const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError.js');
const APIFeatures = require('./../utils/apiFeatures');
const decode = require('./../utils/decode');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = (Model, createOptions) =>
  catchAsync(async (req, res, next) => {
    // const newTour = new Tour({});
    // newTour.save();

    if (createOptions) {
      if (createOptions.attachCreator) {
        const token = await decode(req, next);
        req.body.creator = token.id;
      }
    }

    const doc = await Model.create(req.body);
    console.log(doc);

    res.status(201).json({
      status: 'Success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // data stored in strings, need to convert

    let query = Model.findById(req.params.id);
    // populate may have an impact on performance?
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    // Tour.finndOne({ _id: req.params.id})
    res.status(200).json({
      // JSend specs
      status: 'Sucess',
      data: {
        data: doc
      }
    });

    // const tour = tours.find(el => el.id === id);
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    // Tour.find is a Query Object, req.query is the query string. We manipulate the query using the information with the query string.
    let filter = {};
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    // const doc = await features.query.explain();

    // SEND RESPONSE
    res.status(200).json({
      // JSend specs
      status: 'Sucess',
      results: doc.length,
      data: {
        doc
      }
    });
  });
