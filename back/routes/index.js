const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = express.Router();
const checkToken = require('../middlewares/webToken/checkToken')
const checkTokenCookie = require('../middlewares/webToken/checkTokenCookie')

const user = require('./register/register.route')
const image = require('./image/image.route')
const premium = require('./premium/Premium.route')
const subscriber = require('./subscriber/Subscriber.route')

router.use(cookieParser());

router.use('/user', cors({ credentials: true, origin: process.env.ORIGIN_URL }), user)

router.use('/image', cors({ credentials: true, origin: process.env.ORIGIN_URL }), image)

router.use('/premium', cors({ credentials: true, origin: process.env.ORIGIN_URL }), premium)

router.use('/subscriber', cors({ credentials: true, origin: process.env.ORIGIN_URL }), subscriber)

router.use('/create-customer', cors({ credentials: true, origin: process.env.ORIGIN_URL }), async (req, res) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: req.body.email,
    name: req.body.name
  });

  // Recommendation: save the customer.id in your database.
  res.send({ customer });
});

router.use('/create-subscription', cors({ credentials: true, origin: process.env.ORIGIN_URL }), async (req, res) => {
  console.log(req.body.paymentMethodId)
  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId,
    });
  } catch (error) {
    return res.status('402').send({ error: { message: error.message } });
  }
  await stripe.customers.update(
    req.body.customerId,
    {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId,
      },
    }
  );
  console.log(req.body.customerId)
  console.log(req.body.priceId)
  const subscription = await stripe.subscriptions.create({
    customer: req.body.customerId,
    items: [{ price: req.body.priceId }],
    expand: ['latest_invoice.payment_intent'],
  });
  res.send(subscription);
});

router.use('/get-subscription', cors({ credentials: true, origin: process.env.ORIGIN_URL }), (req, res) => {

  const checkingToken = checkToken(req, res)
  const checkingTokenCookie = checkTokenCookie(res, req)
  if ((checkingToken === false) || checkingTokenCookie === false) {
      return res.status(400).send({
          message: 'error token'
      })
  }

  stripe.subscriptions.list(
    function(err, subscriptions) {
      console.log(subscriptions)
      if (err) {
        return res.status('402').send({ error: { message: err.message } });
      }
      else if (subscriptions) return res.send(subscriptions).status(200);
    }
  );
  return res.status(200);
});



router.use('/create-product', cors({ credentials: true, origin: process.env.ORIGIN_URL }), (req, res) => {
  const checkingToken = checkToken(req, res)
  const checkingTokenCookie = checkTokenCookie(res, req)
  if ((checkingToken === false) || checkingTokenCookie === false) {
      return res.status(400).send({
          message: 'error token'
      })
  }

  console.log(req.body.pseudo)

  try {
    stripe.products.create(
      { name: req.body.pseudo },
      function (err, confirmation) {
        if (err) {
          return res.status('402').send({ error: { message: err.message } });
        }
        else if (confirmation) return res.send(confirmation).status(200);
      }
    );
  } catch (error) {
    return res.status('402').send({ error: { message: error.message } });
  }
  return res.status(200);
});



router.use('/create-price', cors({ credentials: true, origin: process.env.ORIGIN_URL }), (req, res) => {

  const checkingToken = checkToken(req, res)
  const checkingTokenCookie = checkTokenCookie(res, req)
  if ((checkingToken === false) || checkingTokenCookie === false) {
      return res.status(400).send({
          message: 'error token'
      })
  }

  try {
    stripe.prices.create(
      {
        unit_amount: (req.body.price*100),
        currency: 'EUR',
        recurring: { interval: 'month' },
        product: req.body.product,
      },
      function (err, price) {
        if (err) {
          return res.status('402').send({ error: { message: err } });
        }
        else if (price) return res.send(price).status(200);
      }
    );
  } catch (error) {
    return res.status('402').send({ error: { message: error.message } });
  }
  return res.status(200);
});



router.use('/cancel-subscription', cors({ credentials: true, origin: process.env.ORIGIN_URL }), async (req, res) => {
  // Delete the subscription
  const deletedSubscription = await stripe.subscriptions.del(
    req.body.subscriptionId
  );
  res.send(deletedSubscription);
});

router.use('/cookie', cors({ credentials: true, origin: process.env.ORIGIN_URL }), function (req, res) {


  // Génération du jsonWebToken
  const token = jwt.sign('5', `${process.env.SECRET_KEY}`);

  res.cookie('token', token, { maxAge: (Date.now() / 1000 + (60 * 60 * 120)), httpOnly: true });
  res.send('cookie ok')
})

module.exports = router;