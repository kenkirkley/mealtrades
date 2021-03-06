const Offer = require('../models/offerModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. get tour data from collection
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  // 2. build template
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 3. render template

  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour
  });
});

exports.getHome = catchAsync(async (req, res, next) => {
  const offers = await Offer.find({});
  res.status(200).render('home', {
    title: 'Homepage',
    offers
  });
});

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get tour data from collection
  const offers = await Offer.find();
  // 2) Build template

  // 3) Render that template using data

  res.status(200).render('overview', {
    title: 'All Offers',
    offers
  });
});

exports.getListing = catchAsync(async (req, res, next) => {
  // 1. Get tour data from collection
  try {
    const offer = await Offer.findById(req.params.offerid);
    // if id is in proper format, but is invalid
    if (!offer) {
      return next(
        new AppError(
          'The listing is no longer valid or could not be found.',
          404
        )
      );
    }

    res.status(200).render('singlelisting', {
      title: 'Listing',
      offer
    });
  } catch (err) {
    // if id is in incorrect format
    return next(
      new AppError('The listing is no longer valid or could not be found.', 404)
    );
  }
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.signup = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign up for a new account'
  });
};

exports.forgotPassword = (req, res, next) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot your Password?'
  });
};
exports.emailSent = (req, res, next) => {
  res.status(200).render('emailSent', {
    title: 'Email Sent'
  });
};

exports.resetPassword = (req, res, next) => {
  console.log(req.params.token);
  res.status(200).render('resetPassword', {
    title: 'Reset your Password',
    token: req.params.token
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

exports.confirmOffer = catchAsync(async (req, res, next) => {
  // need to make a confirmation page for the offer
  const offer = Offer.findById(req.params.offerid);
  const consumer = User.findById(req.params.consumerid);

  // show offer and consumer info. Also need button to confirm or deny
  // render pug template, pass in offer and consumer
});
