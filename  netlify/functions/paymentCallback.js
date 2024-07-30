const handler = async (event) => {
    try {
      const body = JSON.parse(event.body);
      console.log("Payment callback received:", body);
      
      // TODO: Verify the payment status and handle it as needed
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Payment callback processed' }),
      };
    } catch (error) {
      console.error("Error processing callback:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error processing callback' }),
      };
    }
  };
  
  module.exports = { handler };
  