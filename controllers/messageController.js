const Nexmo = require('nexmo');

exports.recieveText = (req, res, next) => {
  const params = Object.assign(req.query, req.body);
  console.log(params);
  res.status(204).json({
    status: 'success'
  });
};

exports.sendText = (destNumber, text) => {
  const nexmo = new Nexmo({
    apiKey: '975a39c3',
    apiSecret: 'tt951SvmdYp2Pm94'
  });

  const from = process.env.NEXMO_VIRTUAL_NUMBER;
  // number from creator document
  const to = destNumber;
  // desired text message content

  nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]['status'] !== '0') {
        console.log(
          `Message failed with error: ${responseData.messages[0]['error-text']}`
        );
      }
      console.log('Message sent successfully.');
    }
  });
};
