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
    'PAYDUNYA-MASTER-KEY': '0vfJty7v-qSyX-Wf4N-If2b-SwXgyxzw4sa4',
    'PAYDUNYA-PRIVATE-KEY': 'live_private_TO4GJEwN2DSUdpS26j08327C4yV',
    'PAYDUNYA-PUBLIC-KEY': 'live_public_6g2X5rSRadHow5RDYDKdZ8JGhp4',
    'PAYDUNYA-TOKEN': 'k1ms77gbiyR70KUYLAve',
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
