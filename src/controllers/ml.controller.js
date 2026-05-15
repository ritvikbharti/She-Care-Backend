// const axios = require("axios");

// exports.predictPCOS = async (req, res) => {
//   try {
//     const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

//     if (!ML_SERVICE_URL) {
//       return res.status(500).json({
//         success: false,
//         error: "ML_SERVICE_URL not configured in environment",
//       });
//     }

//     const mlRes = await axios.post(`${ML_SERVICE_URL}/predict`, req.body);

//     return res.json({
//       success: true,
//       riskPercentage: mlRes.data.pcos_probability * 100,
//       detected: mlRes.data.pcos_detected === 1,
//     });
//   } catch (err) {
//     console.error("ML Prediction Error:", err.response?.data || err.message);

//     return res.status(500).json({
//       success: false,
//       error: "Prediction failed",
//       details: err.response?.data || err.message,
//     });
//   }
// };


const axios = require("axios");

exports.predictPCOS = async (req, res) => {
  try {

    const HF_URL =
      "https://ritvikbharti01-pcos-ml-api.hf.space";

    // Step 1: Send request to Hugging Face
    const startPrediction = await axios.post(
      `${HF_URL}/gradio_api/call/v2/predict`,
      {
        BMI: req.body.BMI,
        Cycle_length: req.body.Cycle_length,
        FSH: req.body.FSH,
        LH: req.body.LH,
        FSH_LH: req.body.FSH_LH,
        AMH: req.body.AMH,
        Follicle_No_L: req.body.Follicle_No_L,
        Follicle_No_R: req.body.Follicle_No_R,
        Endometrium: req.body.Endometrium
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Step 2: Get event ID
    const eventId = startPrediction.data.event_id;

    // Step 3: Fetch prediction result
    const resultResponse = await axios.get(
      `${HF_URL}/gradio_api/call/predict/${eventId}`
    );

    // Step 4: Extract prediction data
    const responseText = resultResponse.data;

    // Gradio sometimes returns string/SSE response
    const jsonMatch = responseText.match(/\{.*\}/s);

    if (!jsonMatch) {
      throw new Error("Could not parse prediction response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const prediction = parsed.data[0];

    // Step 5: Send clean response to frontend
    return res.json({
      success: true,
      riskPercentage: prediction.pcos_probability * 100,
      detected: prediction.pcos_detected === 1,
    });

  } catch (err) {

    console.error(
      "ML Prediction Error:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      success: false,
      error: "Prediction failed",
      details: err.response?.data || err.message,
    });
  }
};
