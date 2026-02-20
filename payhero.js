const axios = require("axios");

async function initiatePayHeroPayment(phoneNumber) {
  try {
    // Hardcoded credentials (since you asked for working code directly)
    const USERNAME = "hl5wD3L9XZuJiG9CVRHF";
    const PASSWORD = "cGTDAmBqQGHCFaHnHhii2myrs8SVAJUASr107IN7";
    const CHANNEL_ID = 5413;
    const AMOUNT = 149;
    const CALLBACK_URL = "https://pesacrdt.online/api/payhero/callback";

    // Generate Basic Auth token properly
    const authToken = Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");

    const payload = {
      amount: AMOUNT,
      phone_number: phoneNumber, // must be 07XXXXXXXX or 254XXXXXXXXX
      channel_id: CHANNEL_ID,
      provider: "m-pesa",
      external_reference: `PESACRDT-${Date.now()}`,
      callback_url: CALLBACK_URL,
    };

    console.log("🚀 Sending PayHero Request:", payload);
    console.log("🔐 Auth Token:", authToken);

    const response = await axios.post(
      "https://backend.payhero.co.ke/api/v2/payments",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
        },
        timeout: 15000,
      }
    );

    console.log("✅ PayHero Response:", response.data);

    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    console.error("❌ PayHero Error:", error.response?.data || error.message);

    return {
      success: false,
      error: error.response?.data || { message: "Payment request failed" },
    };
  }
}

module.exports = { initiatePayHeroPayment };