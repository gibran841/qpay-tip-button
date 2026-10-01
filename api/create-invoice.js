module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const usdAmount = 60.00;

    const orderId =
      `API-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const response = await fetch("https://useqpay.com/invoice", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.QPAY_API_KEY}`
      },

      body: JSON.stringify({
        usdAmount,
        orderId,
        description: "Q+Pay API Checkout"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || "Q+Pay API request failed"
      });
    }

    return res.status(200).json({
      invoiceId: data.invoiceId,
      quAmount: data.quAmount,
      checkoutUrl: data.checkoutUrl,
      shortUrl: data.shortUrl
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
};