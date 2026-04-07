from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

FEATURES = ["pm25", "pm10", "no2", "o3", "co", "temp", "humidity", "wind_speed"]
TARGET = "aqi"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train AirSense AQI model")
    parser.add_argument("--data", default="data/air_quality_sample.csv", help="Path to training CSV")
    parser.add_argument("--model", default="models/airsense_model.joblib", help="Path to output model")
    parser.add_argument("--metrics", default="models/metrics.json", help="Path to metrics JSON")
    parser.add_argument("--test-size", type=float, default=0.2, help="Test split ratio")
    parser.add_argument("--random-state", type=int, default=42, help="Random state")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    root = Path(__file__).resolve().parents[1]
    data_path = root / args.data
    model_path = root / args.model
    metrics_path = root / args.metrics

    if not data_path.exists():
        raise FileNotFoundError(f"Training data not found: {data_path}")

    df = pd.read_csv(data_path)
    missing = [c for c in FEATURES + [TARGET] if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=args.test_size,
        random_state=args.random_state,
    )

    model = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "regressor",
                RandomForestRegressor(
                    n_estimators=300,
                    max_depth=12,
                    min_samples_split=4,
                    random_state=args.random_state,
                    n_jobs=-1,
                ),
            ),
        ]
    )

    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    rmse = float(np.sqrt(mean_squared_error(y_test, predictions)))
    metrics = {
        "mae": float(mean_absolute_error(y_test, predictions)),
        "rmse": rmse,
        "r2": float(r2_score(y_test, predictions)),
        "train_rows": int(X_train.shape[0]),
        "test_rows": int(X_test.shape[0]),
    }

    model_path.parent.mkdir(parents=True, exist_ok=True)
    metrics_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": model, "features": FEATURES}, model_path)
    metrics_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    print(f"Model saved: {model_path}")
    print(f"Metrics saved: {metrics_path}")
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
