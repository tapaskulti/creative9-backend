const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const app = express();
const PORT = process.env.PORT || 5000;

const Environment = paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(new Environment('AcA2KJ9ftu-JsUUx95Sx8P2DVdbMGzMXYTcqGNPbbSnNgiLJ0_suCdwJIdX3D_SkHEAzhNEtBL0_xy1k', 'EA4uoByVD7bK6H1-YqD_VtPT91I8Ll9SYmoOPLBQLl7CGeFqlTZS77Xa77Dgf243vrgMrCUQGOVGbUf8'));

app.use(express.json());

app.post('/api/create-order', async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '100.00' // replace with the actual amount
      }
    }]
  });

  try {
    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/capture-order', async (req, res) => {
  const { orderID } = req.body;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await paypalClient.execute(request);
    res.json(capture.result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
