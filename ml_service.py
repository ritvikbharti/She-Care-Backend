from flask import Flask, request, jsonify
import joblib
import numpy as np

# Load model using joblib for better stability
model = joblib.load("pcos_random_forest_model.pkl")

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        
        # Align features with the model's training data (9 features)
        X = np.array([[ 
            float(data["BMI"]),
            float(data["Cycle_length"]),
            float(data["FSH"]),
            float(data["LH"]),
            float(data["FSH_LH"]),
            float(data["AMH"]),
            int(data["Follicle_No_L"]),
            int(data["Follicle_No_R"]),
            float(data["Endometrium"])
        ]])

        prob = model.predict_proba(X)[0][1]  # probability of PCOS
        detected = model.predict(X)[0]      # 0 or 1 result

        return jsonify({
            "pcos_probability": round(float(prob), 4),
            "pcos_detected": int(detected)
        })
        
    except KeyError as e:
        return jsonify({"error": f"Missing field in request: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)