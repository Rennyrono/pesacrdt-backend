const axios = require("axios");

async function initiatePayHeroPayment(phoneNumber) {
  try {
    const payload = {
      amount: Number(process.env.APPLICATION_FEE),
      phone_number: phoneNumber,
      provider: "m-pesa",
      network_code: "63902",
      channel_id: Number(process.env.PAYHERO_CHANNEL_ID),
      account_id: Number(process.env.PAYHERO_ACCOUNT_ID),
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
        timeout: 15000,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("❌ PayHero Error:", error.response?.data || error.message);

    return {
      success: false,
      error: error.response?.data || "Payment request failed",
    };
  }
}

module.exports = { initiatePayHeroPayment };
