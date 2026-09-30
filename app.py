from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Demo values for the first UI build.
# Replace these with Earth Engine-derived values in the integration step.
DEMO = {
    "region": "Tamil Nadu Agriculture Zone",
    "ndvi": 0.48,
    "ndmi": 0.21,
    "lst": 34.6,
    "rainfall": 41.2,
    "stress_score": 63,
    "class": "High Stress",
    "healthy_pct": 28,
    "moderate_pct": 39,
    "high_pct": 23,
    "severe_pct": 10,
}

@app.route("/")
def index():
    return render_template("index.html", data=DEMO)

@app.route("/api/summary")
def summary():
    return jsonify(DEMO)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
