// AGRI-SHIELD
// Agricultural Drought Stress Detection
// Run in the Google Earth Engine Code Editor.
//
// MVP indicators:
//   NDVI  = (NIR - RED) / (NIR + RED)
//   NDMI  = (NIR - SWIR1) / (NIR + SWIR1)
//   LST   = MODIS 8-day daytime land surface temperature
//   Rain  = CHIRPS daily precipitation
//
// IMPORTANT:
// This first version demonstrates the geospatial pipeline.
// Thresholds should be calibrated for the selected crop/region.

var roi = Map.getBounds(true);

// ---------- Sentinel-2 ----------
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(roi)
  .filterDate('2026-06-01', '2026-09-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 40));

var composite = s2.median().divide(10000);

var ndvi = composite.normalizedDifference(['B8', 'B4']).rename('NDVI');
var ndmi = composite.normalizedDifference(['B8', 'B11']).rename('NDMI');

// ---------- MODIS LST ----------
var lst = ee.ImageCollection('MODIS/061/MOD11A2')
  .filterBounds(roi)
  .filterDate('2026-06-01', '2026-09-01')
  .select('LST_Day_1km')
  .mean()
  .multiply(0.02)
  .subtract(273.15)
  .rename('LST_C');

// ---------- CHIRPS rainfall ----------
var rainfall = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .filterBounds(roi)
  .filterDate('2026-06-01', '2026-09-01')
  .select('precipitation')
  .sum()
  .rename('Rain_mm');

// ---------- Normalize indicators ----------
// Higher stress should produce a higher score.
//
// NDVI stress: low NDVI -> high stress
var ndviStress = ee.Image(1).subtract(ndvi.unitScale(0.2, 0.8))
  .clamp(0, 1);

// NDMI stress: low moisture -> high stress
var ndmiStress = ee.Image(1).subtract(ndmi.unitScale(-0.2, 0.5))
  .clamp(0, 1);

// LST stress: high temperature -> high stress
var lstStress = lst.unitScale(25, 45).clamp(0, 1);

// Rain stress: low recent rainfall -> high stress
var rainStress = ee.Image(1).subtract(rainfall.unitScale(50, 300))
  .clamp(0, 1);

// Weighted composite drought-stress score, 0-100.
var stress = ndviStress.multiply(0.35)
  .add(ndmiStress.multiply(0.30))
  .add(lstStress.multiply(0.20))
  .add(rainStress.multiply(0.15))
  .multiply(100)
  .rename('DroughtStress');

// Classes:
// 0-25 Normal
// 25-50 Moderate
// 50-75 High
// 75-100 Severe
var stressClass = stress.expression(
  "(s < 25) ? 1 : (s < 50) ? 2 : (s < 75) ? 3 : 4",
  {s: stress}
).rename('StressClass');

Map.addLayer(ndvi, {min: 0, max: 0.8, palette: ['brown', 'yellow', 'green']}, 'NDVI');
Map.addLayer(ndmi, {min: -0.2, max: 0.5, palette: ['brown', 'yellow', 'blue']}, 'NDMI');
Map.addLayer(stress, {min: 0, max: 100, palette: ['00a65a', 'e7c65b', 'ee9a50', 'ed6868']}, 'Drought Stress');
Map.centerObject(roi, 10);

print('Sentinel-2 image count:', s2.size());
print('Drought stress image:', stress);
print('Stress class:', stressClass);
