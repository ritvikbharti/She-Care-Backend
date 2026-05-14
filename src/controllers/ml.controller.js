const axios = require("axios");

exports.predictPCOS = async (req, res) => {
  try {
    const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

    if (!ML_SERVICE_URL) {
      return res.status(500).json({
        success: false,
        error: "ML_SERVICE_URL not configured in environment",
      });
    }

    const mlRes = await axios.post(`${ML_SERVICE_URL}/predict`, req.body);

    return res.json({
      success: true,
      riskPercentage: mlRes.data.pcos_probability * 100,
      detected: mlRes.data.pcos_detected === 1,
    });
  } catch (err) {
    console.error("ML Prediction Error:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      error: "Prediction failed",
      details: err.response?.data || err.message,
    });
  }
};