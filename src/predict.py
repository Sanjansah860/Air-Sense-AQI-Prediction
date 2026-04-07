from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import pandas as pd


def aqi_category(aqi: float) -> str:
    if aqi <= 50:
        return "Good"
    if aqi <= 100:
        return "Moderate"
    if aqi <= 150:
        return "Unhealthy for Sensitive Groups"
    if aqi <= 200:
        return "Unhealthy"
    if aqi <= 300:
        return "Very Unhealthy"
    return "Hazardous"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Predict AQI using trained AirSense model")
    parser.add_argument("--model", default="models/airsense_model.joblib", help="Path to model artifact")
    parser.add_argument("--pm25", type=float, required=True)
    parser.add_argument("--pm10", type=float, required=True)
    parser.add_argument("--no2", type=float, required=True)
    parser.add_argument("--o3", type=float, required=True)
    parser.add_argument("--co", type=float, required=True)
    parser.add_argument("--temp", type=float, required=True)
    parser.add_argument("--humidity", type=float, required=True)
    parser.add_argument("--wind_speed", type=float, required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    root = Path(__file__).resolve().parents[1]
    model_path = root / args.model
    if not model_path.exists():
        raise FileNotFoundError(
            f"Model not found: {model_path}. Run `python src/train.py` first."
        )

    payload = joblib.load(model_path)
    model = payload["model"]
    features = payload["features"]

    row = {
        "pm25": args.pm25,
        "pm10": args.pm10,
        "no2": args.no2,
        "o3": args.o3,
        "co": args.co,
        "temp": args.temp,
        "humidity": args.humidity,
        "wind_speed": args.wind_speed,
    }

    frame = pd.DataFrame([row])[features]
    predicted_aqi = float(model.predict(frame)[0])

    print(f"Predicted AQI: {predicted_aqi:.1f}")
    print(f"Category: {aqi_category(predicted_aqi)}")


if __name__ == "__main__":
    main()
