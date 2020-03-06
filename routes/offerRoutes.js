const express = require('express');
const offerController = require('./../controllers/offerController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, offerController.createOffer)
  .get(offerController.getAllOffers);

router
  .route('/:id')
  .get(offerController.getOffer)
  .patch(authController.protect, offerController.updateOffer)
  .delete(authController.protect, offerController.deleteOffer);

// This used to be get. if any problems
router
  .route('/:id/consume')
  .post(authController.protect, offerController.consumeOffer);

// USE THIS IN THE AXIOS REQUEST WHEN THE ACCEPT BUTTON IS PRESSED
router
  .route('/confirm/offer/:offerid/consumer/:consumerid/accept/:confirmation')
  .post(authController.protect, offerController.confirmOffer);

module.exports = router;
