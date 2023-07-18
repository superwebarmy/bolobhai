const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000; // Change this to the desired port number

// Replace these with your Twitter API credentials
const consumerKey = process.env.CONSUMERKEY;
const consumerSecret = process.env.CONSUMERSECRET;
const accessToken = process.env.ACCESSTOKEN;
const accessTokenSecret = process.env.ACESSTOKENSECRET;


function computeCRCResponse(token, crcToken) {
  const hmac = crypto.createHmac('sha256', token).update(crcToken).digest('base64');
  return `sha256=${hmac}`;
}

app.use(bodyParser.json());

app.get('/twitter/webhook', (req, res) => {
    const crcToken = req.query.crc_token;
    console.log(crcToken);
    if (!crcToken) {
      res.status(400).send('Error: CRC token missing.');
      return;
    }
  
    const responseToken = computeCRCResponse(consumerSecret, crcToken);
    res.status(200).json({ response_token: responseToken });
});

app.post('/twitter/webhook', (req, res) => {
    // Your event handling code here
    console.log('Received Twitter event:', req.body);
  
    // Respond with a 200 status to acknowledge receipt of the event
    res.sendStatus(200);
});
  
  

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });