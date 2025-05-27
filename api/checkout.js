export default async function handler(req, res) {
  const { order, amount } = req.query;

  const payload = {
    invoice: {
      items: [
        {
          name: `Commande #${order}`,
          quantity: 1,
          unit_price: parseInt(amount),
          total_price: parseInt(amount),
        },
      ],
      total_amount: parseInt(amount),
      description: `Paiement de la commande Shopify #${order}`,
    },
    store: {
      name: 'La Fabrik SN',
      tagline: 'Mobilier et portes sur mesure',
      phone: '77XXXXXXX',
      website_url: 'https://lafabriksn.com',
    },
    actions: {
      cancel_url: 'https://lafabriksn.com/annulation',
      return_url: 'https://lafabriksn.com/merci',
    },
  };

  const headers = {
    'Content-Type': 'application/json',
    'PAYDUNYA-MASTER-KEY': 'VOTRE_MASTER_KEY',
    'PAYDUNYA-PRIVATE-KEY': 'VOTRE_PRIVATE_KEY',
    'PAYDUNYA-PUBLIC-KEY': 'VOTRE_PUBLIC_KEY',
    'PAYDUNYA-TOKEN': 'VOTRE_TOKEN',
  };

  try {
    const response = await fetch('https://app.paydunya.com/api/v1/checkout-invoice/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.response_code === '00') {
      return res.redirect(data.response_text);
    } else {
      return res.status(400).send(`Erreur PayDunya : ${data.response_text}`);
    }
  } catch (err) {
    return res.status(500).send(`Erreur serveur : ${err.message}`);
  }
}