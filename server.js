const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;
const PAYSTACK_SECRET_KEY = 'sk_live_3481588a33155f1476ac60410f3478d0d8253d3f';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/payment/callback', async (req, res) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).send('Transaction reference is missing');
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const { status, data } = response.data;

    if (status) {
      if (data.status === 'success') {
        console.log(`Transaction successful: ${reference}`);
        // Update your database or notify your main application here
      } else {
        console.log(`Transaction failed: ${reference}`);
        // Handle failed transaction here
      }
    }

    res.status(200).send('Callback received');
  } catch (error) {
    console.error('Error verifying transaction:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
