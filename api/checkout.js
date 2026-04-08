import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Metodo non permesso');
  }

  try {
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items,
      success_url: 'https://tuosito.com/success',
      cancel_url: 'https://tuosito.com/cancel'
    });

    res.status(200).json({ url: session.url });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
