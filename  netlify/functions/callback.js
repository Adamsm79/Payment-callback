const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const { reference } = JSON.parse(event.body);

    if (!reference) {
      return {
        statusCode: 400,
        body: 'Transaction reference is missing',
      };
    }

    try {
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      });

      const { status, data } = response.data;

      if (status) {
        if (data.status === 'success') {
          console.log(`Transaction successful: ${reference}`);
          return {
            statusCode: 200,
            body: 'Callback received',
          };
        } else {
          console.log(`Transaction failed: ${reference}`);
          return {
            statusCode: 400,
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
