import axios from "axios";

/**
 * Initiates an M-Pesa STK Push via PayHero
 * @param {Object} params
 * @param {string} params.phoneNumber - Customer phone (07XXXXXXXX)
 * @param {number} params.amount - Amount to charge (KES)
 * @param {string} params.externalRef - Your internal reference
 */
export async function initiatePayHeroPayment({
  phoneNumber,
  amount,
  externalRef
}) {
  try {
    const payload = {
      amount: amount, // 👈 THIS IS WHERE AMOUNT IS SET
      phone_number: phoneNumber,
      provider: "m-pesa",
      network_code: "63902",
      channel_id: Number(process.env.PAYHERO_CHANNEL_ID), // 5413
      account_id: Number(process.env.PAYHERO_ACCOUNT_ID), // 4524
      external_reference: externalRef,
      callback_url: process.env.PAYHERO_CALLBACK_URL
    };

    const response = await axios.post(
      "https://api.payhero.africa/api/v2/payments",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.PAYHERO_BASIC_TOKEN}`
        },
        timeout: 15000
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("PayHero Error:", error.response?.data || error.message);

    return {
      success: false,
      error: error.response?.data || "Payment request failed"
    };
  }
}
