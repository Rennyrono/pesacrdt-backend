const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// MIDDLEWARE
// ===============================
app.use(express.json());
app.use(cors());

// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("Pesacredit backend running (PayHero)");
});

// ===============================
// PAYHERO STK PUSH (TILL)
// ===============================
app.post("/api/payhero/pay", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  console.log("📞 Phone received:", phoneNumber);

  try {
    const payload = {
      amount: Number(process.env.APPLICATION_FEE), // 149
      phone_number: phoneNumber,
      provider: "m-pesa",
      network_code: "63902",
      channel_id: Number(process.env.PAYHERO_CHANNEL_ID), // 5413
      account_id: Number(process.env.PAYHERO_ACCOUNT_ID), // 4524
      external_reference: `PESACRDT-${Date.now()}`,
      callback_url: process.env.PAYHERO_CALLBACK_URL,
    };

    const response = await axios.post(
      "https://api.payhero.africa/api/v2/payments",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.PAYHERO_BASIC_TOKEN}`,
        },
      }
    );

    console.log("📲 PAYHERO RESPONSE:", response.data);

    return res.json({
      success: true,
      message: "Payment prompt sent to phone",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "❌ PAYHERO ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      error: "Failed to initiate PayHero payment",
    });
  }
});

// ===============================
// PAYHERO CALLBACK (WEBHOOK)
// ===============================
app.post("/api/payhero/callback", (req, res) => {
  console.log("🔔 PAYHERO CALLBACK RECEIVED:");
  console.log(JSON.stringify(req.body, null, 2));

  // Here you can:
  // - mark user as paid
  // - store transaction in DB
  // - unlock next steps

  res.json({ received: true });
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log("🔥 RUNNING Server/index.js 🔥");
  console.log(`Server running on http://localhost:${PORT}`);
});
