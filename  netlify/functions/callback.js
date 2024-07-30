const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    try {
      const { reference } = JSON.parse(event.body);
      
      if (!reference) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Transaction reference is missing' }),
        };
      }

      const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
      
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      });

      const { data } = response;

      if (data.status === 'success') {
        console.log(`Transaction successful: ${reference}`);
        // Update your database or notify your main application here

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Transaction successful' }),
        };
      } else {
        console.log(`Transaction failed: ${reference}`);
        // Handle failed transaction here

        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Transaction failed' }),
        };
      }
    } catch (error) {
      console.error('Error verifying transaction:', error);

      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }
};
