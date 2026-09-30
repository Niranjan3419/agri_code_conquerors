# AGRI-SHIELD

Satellite-Based Agricultural Drought Stress Detection & Early Warning System.

## Problem
Agricultural areas can experience vegetation stress because of insufficient moisture.
The system combines satellite-derived vegetation/moisture indicators, land-surface
temperature and rainfall to create a transparent drought-stress score.

## MVP Architecture

Satellite Data
    ↓
Sentinel-2 / CHIRPS / MODIS
    ↓
Image Processing
    ↓
NDVI + NDMI + LST + Rainfall
    ↓
Weighted Drought Stress Model
    ↓
Normal / Moderate / High / Severe
    ↓
Interactive Flask Dashboard
    ↓
Decision Support / Priority Zones

## Run locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open:
http://127.0.0.1:5000

## Google Earth Engine

Open `gee/agri_shield_drought.js` in the Earth Engine Code Editor.
Draw/choose an agricultural region and run the script.

The current script is an MVP model. Thresholds must be calibrated for
the selected crop, season and study region before claiming operational
drought classification.

## Next integration steps

1. Select the exact study region.
2. Run the GEE script.
3. Export drought-stress raster/statistics.
4. Replace the demo values in `app.py`.
5. Replace the map placeholder with the exported GeoJSON/tiles.
6. Add time-series charts and field-level drill-down.
7. Deploy the Flask app.
