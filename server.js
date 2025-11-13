// server.js — backend Node.js pour envoi d'emails
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== PAGE D'ACCUEIL DU SERVEUR =====
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Serveur en cours d'exécution</title>
<style>
  body {
    margin:0; height:100vh;
    display:flex; justify-content:center; align-items:center;
    background: radial-gradient(circle at 20% 20%, #0d1117, #000);
    color:#fff; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; overflow:hidden;
  }
  h1 { font-size:2rem; letter-spacing:1px; text-align:center; animation: fadeIn 1.5s ease forwards; }
  .glow { color:#0ff; text-shadow:0 0 8px #0ff,0 0 16px #00ffff80,0 0 32px #00ffff40; }
  .container {
    text-align:center; padding:40px; border:1px solid #00ffff40; border-radius:16px;
    box-shadow:0 0 20px #00ffff20; background:rgba(0,20,30,0.3); backdrop-filter:blur(8px);
    animation:pulse 3s infinite alternate ease-in-out;
  }
  .status { font-size:1.1rem; color:#aaa; margin-top:10px; }
  @keyframes pulse { from {box-shadow:0 0 10px #00ffff10;} to {box-shadow:0 0 25px #00ffff60;} }
  @keyframes fadeIn { from {opacity:0; transform:translateY(10px);} to {opacity:1; transform:translateY(0);} }
</style>
</head>
<body>
  <div class="container">
    <h1 class="glow">🚀 Serveur MAIL📩 PerrosLABX en cours d'exécution</h1>
    <div class="status">Disponible sur <span style="color:#0ff;">http://localhost:5000</span></div>
  </div>
</body>
</html>`);
});

// ===== CONFIGURATION DU TRANSPORTEUR SMTP =====
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ===== ROUTE D’ENVOI DE MAIL =====
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: 'Champs manquants.' });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: 'Nouveau message depuis le site PerrosLABX',
    html: `
      <div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
        <h2>📩 Nouveau message reçu</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong><br>${message}</p>
        <hr>
        <p style="font-size:0.85rem;color:#555;">
          Ce message a été envoyé automatiquement depuis ton site web.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✉️  Mail envoyé par ${name}`);
    res.status(200).json({ success: true, message: 'Mail envoyé avec succès.' });
  } catch (err) {
    console.error('Erreur envoi mail:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ===== DÉMARRAGE DU SERVEUR =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
