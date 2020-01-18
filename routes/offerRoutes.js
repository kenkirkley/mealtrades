const express = require('express');
const offerController = require('./../controllers/offerController');
// const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').post(offerController.createOffer);

router
  .route('/:id')
  .get(offerController.getOffer)
  .patch(offerController.updateOffer)
  .delete(offerController.deleteOffer);

module.exports = router;
