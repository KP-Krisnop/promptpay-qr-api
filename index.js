const express = require('express');
const app = express();
const QRCode = require('qrcode');
const generatePayload = require('promptpay-qr');
const bodyParser = require('body-parser');
const _ = require('lodash');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(3000, () => {
  console.log('server is running...');
});

app.post('/generateQR', (req, res) => {
  const amount = parseFloat(_.get(req, ['body', 'amount']));
  const mobileNumber = req.body.mobileNumber;
  const payload = generatePayload(mobileNumber, { amount });
  const option = {
    color: {
      dark: '#000',
      light: '#fff',
    },
  };

  console.log('Amount : ' + amount);
  console.log('Mobile Number : ' + mobileNumber);
  console.log(payload);

  QRCode.toDataURL(payload, option, (err, url) => {
    if (!err) {
      console.log('generate success');
      return res.status(200).json({
        RespondCode: 200,
        RespondMessage: 'good',
        Result: url,
      });
    } else {
      console.log('generate fail');
      return res.status(400).json({
        RespondCode: 400,
        RespondMessage: 'bad : ' + err,
      });
    }
  });
});

module.exports = app;
