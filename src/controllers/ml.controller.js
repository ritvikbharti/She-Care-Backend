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

    // STEP 1: Start prediction
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
        },
        timeout: 60000
      }
    );

    // STEP 2: Get event_id
    const eventId = startPrediction.data.event_id;

    if (!eventId) {
      throw new Error("No event_id returned from Hugging Face");
    }

    // STEP 3: Wait a little
    await new Promise(resolve => setTimeout(resolve, 4000));

    // STEP 4: Fetch result
    const resultResponse = await axios.get(
      `${HF_URL}/gradio_api/call/predict/${eventId}`,
      {
        timeout: 60000
      }
    );

    const raw = resultResponse.data;

    console.log("HF RAW RESPONSE:", raw);

    // STEP 5: Extract JSON from SSE response
    const match = raw.match(/data:\s*(\{.*\})/s);

    if (!match) {
      throw new Error("Could not extract prediction JSON");
    }

    const parsed = JSON.parse(match[1]);

    const prediction = parsed[0];

    // STEP 6: Return clean response
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
      details: err.response?.data || err.message,
    });
  }
};