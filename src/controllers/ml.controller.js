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

    // STEP 1
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

    const eventId = startPrediction.data.event_id;

    if (!eventId) {
      throw new Error("No event_id returned");
    }

    // STEP 2
    const resultResponse = await axios.get(
      `${HF_URL}/gradio_api/call/v2/predict/${eventId}`,
      {
        responseType: "text"
      }
    );

    const raw = resultResponse.data;

    console.log(raw);

    const match = raw.match(/data:\s*(\[.*\])/s);

    if (!match) {
      throw new Error("Could not extract prediction JSON");
    }

    const parsed = JSON.parse(match[1]);

    const prediction = parsed[0];

    return res.json({
      success: true,
      riskPercentage:
        prediction.pcos_probability * 100,
      detected:
        prediction.pcos_detected === 1
    });

  } catch (err) {

    console.error(
      "ML Prediction Error:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      success: false,
      error: "Prediction failed",
      details:
        err.response?.data || err.message
    });
  }
};