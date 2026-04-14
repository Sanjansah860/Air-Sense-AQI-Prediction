# 🌬️ AirSense – Real-Time Air Quality Intelligence

**AirSense** is a Machine Learning-powered Air Quality Index (AQI) prediction system with a premium interactive web dashboard. It predicts AQI values from pollutant concentrations and environmental parameters, classifies air quality into health tiers, and delivers personalized health recommendations.

![AirSense](https://img.shields.io/badge/ML-Random%20Forest-blue?style=for-the-badge)
![Accuracy](https://img.shields.io/badge/R²%20Score-93.42%25-green?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-yellow?style=for-the-badge)

---
👉 Choose your preferred format:

📄 View/Download PDF (Recommended for quick preview):
[ML_Project_2503A52L20_.pdf](https://github.com/user-attachments/files/26706418/ML_Project_2503A52L20_.pdf)

📊 Download PPT (Editable version):
[ML_Project_2503A52L20_ (1).pptx](https://github.com/user-attachments/files/26706423/ML_Project_2503A52L20_.1.pptx)


## 📌 Problem Statement

Air pollution is a critical global health concern affecting millions worldwide. Citizens lack accessible, easy-to-understand tools to check the Air Quality Index (AQI) and receive actionable health recommendations. AirSense addresses this gap by combining ML-based AQI prediction with an intuitive, visually rich web dashboard.

---

## 🚀 Features

- 🌍 **Global City Search** – Monitor AQI for 500+ cities or use GPS auto-detection
- 🤖 **ML-Powered Predictions** – Random Forest model with 93.4% R² accuracy
- 📈 **7-Day AQI Forecast** – AI-generated trend chart for the upcoming week
- ⚖️ **City Comparison** – Compare air quality between any two cities side-by-side
- 🧪 **6 Pollutant Analysis** – Detailed breakdown of PM2.5, PM10, O₃, NO₂, SO₂, CO
- 🌡️ **Weather Integration** – Temperature, humidity, wind speed, and visibility data
- 💡 **Health Advisories** – Personalized Do's & Don'ts based on AQI level
- 🌗 **Dark/Light Mode** – Toggle between themes with persistent preference
- 📊 **Animated Visualizations** – SVG gauge, canvas charts, animated counters
- 📍 **GPS Location** – Auto-detect your location for instant results

---

## 🧠 ML Model Details

| Parameter | Value |
|-----------|-------|
| **Algorithm** | Random Forest Regressor (scikit-learn) |
| **Pipeline** | StandardScaler → 300 Decision Trees |
| **Max Depth** | 12 |
| **Features** | PM2.5, PM10, NO₂, O₃, CO, Temp, Humidity, Wind Speed |
| **Target** | AQI (Air Quality Index) |

### Performance Metrics

| Metric | Value |
|--------|-------|
| **R² Score** | 0.9342 (93.42%) |
| **MAE** | 21.78 |
| **RMSE** | 22.19 |

---

## 📁 Project Structure

```
AirSense/
├── index.html              # Main web dashboard
├── style.css               # Premium CSS design system
├── script.js               # Frontend logic & visualizations
├── README.md               # Project documentation
├── data/
│   ├── air_quality_sample.csv   # Training dataset
│   └── city_day.csv             # Real-world Indian city data (2.5 MB)
├── src/
│   ├── generate_data.py    # Synthetic data generator
│   ├── train.py            # Model training pipeline
│   └── predict.py          # CLI prediction tool
└── models/
    ├── airsense_model.joblib    # Trained model artifact
    └── metrics.json             # Model performance metrics
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| **ML Model** | Python, scikit-learn, pandas, numpy, joblib |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Visualization** | SVG Gauge, Canvas 2D Charts, CSS Animations |
| **Design** | Glassmorphism, Dark/Light themes, Responsive layout |

---

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.8+
- pip

### Train the Model
```bash
# Install dependencies
pip install scikit-learn pandas numpy joblib

# Generate synthetic training data
python src/generate_data.py

# Train the model
python src/train.py
```

### Run Prediction (CLI)
```bash
python src/predict.py --pm25 45 --pm10 78 --no2 34 --o3 28 --co 1.2 --temp 30 --humidity 60 --wind_speed 2.5
```

### View the Dashboard
Simply open `index.html` in any modern web browser.

---

## 📊 AQI Categories

| AQI Range | Category | Health Impact |
|-----------|----------|---------------|
| 0–50 | 🟢 Good | Air quality is satisfactory |
| 51–100 | 🟡 Moderate | Acceptable; sensitive groups may be affected |
| 101–150 | 🟠 Unhealthy for Sensitive Groups | Sensitive groups should limit outdoor exertion |
| 151–200 | 🔴 Unhealthy | Everyone may experience health effects |
| 201–300 | 🟣 Very Unhealthy | Health alert for everyone |
| 301–500 | ⚫ Hazardous | Emergency health conditions |

---

## 📜 License

This project is built for educational purposes as part of the ML coursework.

---

## 👤 Author

**Sanjan Sah**

---

*Built with 💙 for a cleaner planet*
