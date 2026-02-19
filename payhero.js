const axios = require("axios");

async function initiatePayHeroPayment(phoneNumber) {
  try {
    // Check required env variables
    if (
      !process.env.PAYHERO_USERNAME ||
      !process.env.PAYHERO_PASSWORD ||
      !process.env.PAYHERO_ACCOUNT_ID ||
      !process.env.PAYHERO_CHANNEL_ID ||
      !process.env.APPLICATION_FEE ||
      !process.env.PAYHERO_CALLBACK_URL
    ) {
      throw new Error("Missing PayHero environment variables");
    }

    // Trim to remove hidden spaces
    const username = process.env.PAYHERO_USERNAME.trim();
    const password = process.env.PAYHERO_PASSWORD.trim();

    // Properly generate Basic Auth token
    const authToken = Buffer.from(`${username}:${password}`).toString("base64");

    const payload = {
      amount: Number(process.env.APPLICATION_FEE),
      phone_number: phoneNumber,
      payment_method: "mpesa",
      channel_id: Number(process.env.PAYHERO_CHANNEL_ID),
      account_id: Number(process.env.PAYHERO_ACCOUNT_ID),
      external_reference: `PESACRDT-${Date.now()}`,
      callback_url: process.env.PAYHERO_CALLBACK_URL,
    };

    console.log("🚀 Sending PayHero Request:", payload);

    const response = await axios.post(
      "https://api.payhero.africa/api/v2/payments",
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
