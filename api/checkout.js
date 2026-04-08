import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Metodo non permesso");

  try {
    const { items } = req.body || {};
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "STRIPE_SECRET_KEY mancante su Vercel" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Carrello vuoto o items non validi" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((i) => ({
        price: i.price,
        quantity: Number(i.quantity || 1),
      })),
      success_url: "https://simphonylab.es/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://simphonylab.es/cancel",
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: "Errore checkout: " + (err?.message || "sconosciuto") });
  }
}
