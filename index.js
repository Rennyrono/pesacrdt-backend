const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initiatePayHeroPayment } = require("./payhero");

const app = express();
const PORT = process.env.PORT || 10000;

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
// PAYHERO STK ROUTE
// ===============================
app.post("/api/payhero/stk", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      error: "Phone number is required",
    });
  }

  console.log("📞 Phone received:", phoneNumber);

  try {
    const result = await initiatePayHeroPayment(phoneNumber);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.json({
      success: true,
      message: "Payment prompt sent to phone",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Server Error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// ===============================
// PAYHERO CALLBACK (WEBHOOK)
// ===============================
app.post("/api/payhero/callback", (req, res) => {
  console.log("🔔 PAYHERO CALLBACK RECEIVED:");
  console.log(JSON.stringify(req.body, null, 2));

  // TODO:
  // - Mark user as paid
  // - Store transaction in database
  // - Unlock loan eligibility

  res.json({ received: true });
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log("🔥 RUNNING Server/index.js 🔥");
  console.log(`Server running on port ${PORT}`);
});
