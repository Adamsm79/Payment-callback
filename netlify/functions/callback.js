const axios = require('axios');

// Handler function for Netlify
exports.handler = async function(event) {
  if (event.httpMethod === 'POST') {
    const { body } = event;
    const parsedBody = JSON.parse(body);
    const { reference } = parsedBody;

    // Check if the reference is provided
    if (!reference) {
      return {
        statusCode: 400,
        body: 'Transaction reference is missing',
      };
    }

    try {
      // Replace with your Paystack secret key
      const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

      // Verify the transaction with Paystack
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      });

      const { status, data } = response.data;

      if (status) {
        if (data.status === 'success') {
          console.log(`Transaction successful: ${reference}`);
          // Handle successful transaction here
          return {
            statusCode: 200,
            body: 'Transaction successful',
          };
        } else {
          console.log(`Transaction failed: ${reference}`);
          // Handle failed transaction here
          return {
            statusCode: 200,
            body: 'Transaction failed',
          };
        }
      }

      return {
        statusCode: 200,
        body: 'Callback received',
      };
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return {
        statusCode: 500,
        body: 'Internal Server Error',
      };
    }
  } else {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }
};
