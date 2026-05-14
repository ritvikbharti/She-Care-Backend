const axios = require("axios");

// ✅ Use env var so this works on Render, not just localhost
// Set ML_SERVICE_URL=http://your-python-service-url in your Render environment variables
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:5000";

function calculatePCOSRisk({ BMI, Cycle_length, FSH, LH, FSH_LH, AMH, Follicle_No_L, Follicle_No_R }) {
  let score = 0;
  const flags = [];

  if (FSH_LH < 0.5)           { score += 25; flags.push("High LH:FSH ratio"); }
  else if (FSH_LH < 1.0)      { score += 12; flags.push("Borderline LH:FSH ratio"); }

  if (AMH > 6.0)              { score += 25; flags.push("Very high AMH"); }
  else if (AMH > 4.7)         { score += 18; flags.push("Elevated AMH"); }
  else if (AMH > 3.5)         { score += 8;  flags.push("Borderline AMH"); }

  const totalFollicles = Follicle_No_L + Follicle_No_R;
  if (totalFollicles >= 20)   { score += 20; flags.push("High follicle count"); }
  else if (totalFollicles >= 12) { score += 12; flags.push("Elevated follicle count"); }

  if (Cycle_length > 45)      { score += 15; flags.push("Severely irregular cycle"); }
  else if (Cycle_length > 35) { score += 10; flags.push("Irregular cycle"); }
  else if (Cycle_length < 21) { score += 5;  flags.push("Short cycle"); }

  if (BMI > 30)               { score += 8;  flags.push("Obese BMI"); }
  else if (BMI > 25)          { score += 4;  flags.push("Overweight BMI"); }

  if (LH > 15)                { score += 7;  flags.push("High LH"); }
  else if (LH > 10)           { score += 4;  flags.push("Borderline LH"); }

  if (FSH < 4)                { score += 5;  flags.push("Low FSH"); }

  return {
    riskPercentage: Math.min(100, Math.max(0, score)),
    detected: Math.min(100, Math.max(0, score)) >= 40,
    flags,
  };
}

exports.predictPCOS = async (req, res) => {
  try {
    const fields = ["BMI","Cycle_length","FSH","LH","FSH_LH","AMH","Follicle_No_L","Follicle_No_R","Endometrium"];
    for (const key of fields) {
      if (req.body[key] === undefined || isNaN(Number(req.body[key]))) {
        return res.status(400).json({ success: false, error: `Invalid or missing: ${key}` });
      }
    }

    const result = calculatePCOSRisk({
      BMI:           Number(req.body.BMI),
      Cycle_length:  Number(req.body.Cycle_length),
      FSH:           Number(req.body.FSH),
      LH:            Number(req.body.LH),
      FSH_LH:        Number(req.body.FSH_LH),
      AMH:           Number(req.body.AMH),
      Follicle_No_L: Number(req.body.Follicle_No_L),
      Follicle_No_R: Number(req.body.Follicle_No_R),
      Endometrium:   Number(req.body.Endometrium),
    });

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};