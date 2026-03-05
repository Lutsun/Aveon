const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email pour le client (confirmation de commande, récapitulatif détaillé)
const formatCustomerEmail = (orderData, orderId) => {
  const items = orderData.items.map(item => 
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.size || '-'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.color || '-'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.totalPrice}€</td>
    </tr>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #111; color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th { background-color: #eee; padding: 8px; text-align: left; }
        .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; padding-top: 10px; border-top: 2px solid #111; }
        .success-box { background-color: #e8f5e9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AVEON</h1>
        </div>
        
        <div class="content">
          <div class="success-box">
            <p style="margin: 0; font-weight: bold; font-size: 16px;">✅ Commande confirmée !</p>
            <p style="margin: 5px 0 0;">Votre commande a bien été enregistrée et notre équipe a été notifiée.</p>
          </div>
          
          <p>Bonjour <strong>${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}</strong>,</p>
          
          <p>Merci pour votre commande sur AVEON. Voici votre récapitulatif :</p>
          
          <div class="order-details">
            <p><strong>Numéro de commande :</strong> #${orderId.slice(-8)}</p>
            <p><strong>Date :</strong> ${new Date(orderData.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            
            <h3>Articles commandés :</h3>
            <table style="width: 100%;">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Qté</th>
                  <th>Taille</th>
                  <th>Couleur</th>
                  <th>Prix</th>
                </tr>
              </thead>
              <tbody>
                ${items}
              </tbody>
            </table>
            
            <div class="total">
              Total à payer : <strong>${orderData.total}€</strong>
            </div>
            
            <h3>Adresse de livraison :</h3>
            <p>
              ${orderData.customerInfo.address.street}<br>
              ${orderData.customerInfo.address.city}, ${orderData.customerInfo.address.country}<br>
              ${orderData.customerInfo.phone}
            </p>
          </div>
          
          <p>Vous serez livré dans quelques heures.</p>
          
          <p>Pour toute question, répondez à cet email ou contactez-nous sur WhatsApp.</p>
        </div>
        
        <div class="footer">
          <p>© 2026 AVEON. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email pour le marchand (détaillé, avec infos de contact)
const formatMerchantEmail = (orderData, orderId) => {
  const items = orderData.items.map(item => 
    `• ${item.productName} x${item.quantity}${item.size ? ` (Taille: ${item.size})` : ''}${item.color ? ` (Couleur: ${item.color})` : ''} - ${item.totalPrice}€`
  ).join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #111; color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px; }
        .info-box { background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; }
        .customer-info { background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .badge { background-color: #ff9800; color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 NOUVELLE COMMANDE</h1>
          <p style="margin: 5px 0 0;">AVEON - À traiter</p>
        </div>
        
        <div class="content">
          <div class="info-box">
            <p style="margin: 0; font-weight: bold; font-size: 18px;">Commande #${orderId.slice(-8)}</p>
            <p style="margin: 5px 0 0;">Reçue le ${new Date(orderData.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p style="margin-top: 10px;"><span class="badge">Paiement à la livraison</span></p>
          </div>
          
          <div class="customer-info">
            <h3 style="margin-top: 0;">👤 Informations client</h3>
            <p><strong>Nom :</strong> ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}</p>
            <p><strong>Téléphone :</strong> <a href="tel:${orderData.customerInfo.phone}">${orderData.customerInfo.phone}</a></p>
            <p><strong>Email :</strong> <a href="mailto:${orderData.customerInfo.email}">${orderData.customerInfo.email}</a></p>
          </div>
          
          <div class="order-details">
            <h3 style="margin-top: 0;">📦 Détails de la commande</h3>
            <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; background: #f5f5f5; padding: 10px; border-radius: 5px;">
${items}
            </pre>
            
            <p style="font-size: 16px; font-weight: bold; text-align: right; margin-top: 15px;">
              Total: ${orderData.total}€
            </p>
          </div>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <h3 style="margin-top: 0;">🚚 Adresse de livraison</h3>
            <p>
              ${orderData.customerInfo.address.street}<br>
              ${orderData.customerInfo.address.city}, ${orderData.customerInfo.address.country}
            </p>
            ${orderData.customerInfo.deliveryInstructions ? `
              <p><strong>Instructions :</strong> ${orderData.customerInfo.deliveryInstructions}</p>
            ` : ''}
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://wa.me/${orderData.customerInfo.phone}" 
               style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Contacter le client sur WhatsApp
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>Email envoyé automatiquement par le système AVEON</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Route pour envoyer les emails (client + marchand)
router.post('/send-email', async (req, res) => {
  const { orderId, orderData, customerEmail } = req.body;
  
  // Email du marchand (à configurer dans .env)
  const merchantEmail = process.env.MERCHANT_EMAIL || 'contact@aveon.com';

  try {
    // 1. Envoyer email au client
    await transporter.sendMail({
      from: '"AVEON" <contact@aveon.com>',
      to: customerEmail,
      subject: `Confirmation de commande #${orderId.slice(-8)} - AVEON`,
      html: formatCustomerEmail(orderData, orderId)
    });
    
    console.log('✅ Email client envoyé à:', customerEmail);

    // 2. Envoyer email au marchand (nouvelle commande)
    await transporter.sendMail({
      from: '"AVEON Commandes" <commandes@aveon.com>',
      to: merchantEmail,
      subject: `🔔 NOUVELLE COMMANDE #${orderId.slice(-8)} - ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
      html: formatMerchantEmail(orderData, orderId)
    });
    
    console.log('✅ Email marchand envoyé à:', merchantEmail);

    res.json({ 
      success: true, 
      message: 'Emails envoyés avec succès (client + marchand)' 
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des emails:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi des emails',
      details: error.message 
    });
  }
});

// Route pour tester (optionnel)
router.get('/test', async (req, res) => {
  res.json({ 
    message: 'Route notifications OK',
    merchantEmail: process.env.MERCHANT_EMAIL || 'Non configuré (utilisera contact@aveon.com)'
  });
});

module.exports = router;