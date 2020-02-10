const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
// router.get('/tour', viewsController.getTour);

router.get('/home', viewsController.getHome);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.get('/signup', viewsController.signup);

router.get('/forgotPassword', viewsController.forgotPassword);
router.get('/forgotPassword/sent', viewsController.emailSent);
router.get('/resetPassword/:token', viewsController.resetPassword);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
