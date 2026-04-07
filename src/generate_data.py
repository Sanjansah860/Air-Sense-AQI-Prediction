from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


def clamp(series: np.ndarray, low: float, high: float) -> np.ndarray:
    return np.clip(series, low, high)


def main(rows: int = 1200) -> None:
    rng = np.random.default_rng(42)

    pm25 = rng.normal(45, 22, rows)
    pm10 = pm25 * rng.normal(1.45, 0.18, rows) + rng.normal(8, 10, rows)
    no2 = rng.normal(34, 14, rows)
    o3 = rng.normal(28, 11, rows)
    co = rng.normal(1.1, 0.5, rows)
    temp = rng.normal(24, 9, rows)
    humidity = rng.normal(58, 18, rows)
    wind_speed = rng.normal(2.7, 1.1, rows)

    # Synthetic AQI equation with noise, meant as a project bootstrap.
    aqi = (
        0.75 * pm25
        + 0.22 * pm10
        + 0.45 * no2
        + 0.28 * o3
        + 16 * co
        + 0.12 * temp
        + 0.08 * humidity
        - 3.1 * wind_speed
        + rng.normal(0, 11, rows)
    )

    frame = pd.DataFrame(
        {
            "pm25": clamp(pm25, 2, 280),
            "pm10": clamp(pm10, 4, 420),
            "no2": clamp(no2, 1, 240),
            "o3": clamp(o3, 1, 220),
            "co": clamp(co, 0.1, 12),
            "temp": clamp(temp, -10, 48),
            "humidity": clamp(humidity, 10, 100),
            "wind_speed": clamp(wind_speed, 0.1, 12),
            "aqi": clamp(aqi, 5, 420).round(0),
        }
    )

    out_path = Path(__file__).resolve().parents[1] / "data" / "air_quality_sample.csv"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    frame.to_csv(out_path, index=False)

    print(f"Generated {len(frame)} rows at: {out_path}")


if __name__ == "__main__":
    main()
