const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. get tour data from collection
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  // 2. build template

  // 3. render template

  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour
  });
});

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template

  // 3) Render that template using data

  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};
