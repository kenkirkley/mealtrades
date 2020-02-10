const express = require('express');
const messageController = require('./../controllers/messageController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/recieve')
  .get(messageController.recieveText)
  .post(messageController.recieveText);

module.exports = router;
