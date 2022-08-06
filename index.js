// This is your test secret API key.
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const express = require('express')
const app = express()
const cors = require('cors')
const products = require('./src/data/products.json')

app.use(express.json())
app.use(cors())

// Create GET request
app.get('/', (req, res) => {
  res.send('Express on Vercel')
})

app.get('/catalog', (req, res) => {
  res.send(products)
})

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.shoppingCart.map((item) => {
        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name
            },
            unit_amount: item.price * 100
          },
          quantity: item.amount
        }
      }),
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})
const PORT = process.env.PORT || 4242
app.listen(PORT, () => console.log(`Running on port ${PORT}`))

// Export the Express API
module.exports = app
