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

module.exports = router;
