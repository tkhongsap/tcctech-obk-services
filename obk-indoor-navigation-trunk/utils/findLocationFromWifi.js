export default function findLocationFromWifi(data) {
  console.log("=== findLocationFromWifi", data);

  // Function to calculate weighted average coordinates based on WiFi signals
  function calculateWeightedAverage(wifiSignals) {
    let totalWeight = 0;
    let weightedSumLat = 0;
    let weightedSumLon = 0;

    // Calculate total weight
    for (const signal of wifiSignals) {
      const weight = Math.pow(10, signal.level / 10); // Convert signal level to weight
      totalWeight += weight;
      weightedSumLat += weight * signal.cod[0];
      weightedSumLon += weight * signal.cod[1];
    }

    // Calculate weighted average coordinates
    const weightedAvgLat = weightedSumLat / totalWeight;
    const weightedAvgLon = weightedSumLon / totalWeight;

    return [weightedAvgLat, weightedAvgLon];
  }

  // Estimate indoor location based on WiFi signals
  const estimatedLocation = calculateWeightedAverage(data);

  return estimatedLocation;
}

