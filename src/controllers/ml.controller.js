const axios = require("axios");

exports.predictPCOS = async (req, res) => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/predict", req.body);

    const risk = response.data.pcos_probability * 100;
    const detected = response.data.pcos_detected;

    res.json({
      success: true,
      riskPercentage: risk,
      detected
    });

  } catch (err) {
    console.error("ML ERROR:", err.message);
    res.status(500).json({ success: false, error: "ML Server Failed" });
  }
};