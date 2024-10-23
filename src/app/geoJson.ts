import type { LatLong } from "./LatLong";

const radiusInDegrees = 0.5; // 30km or thereabouts

export function geoJsonUrl(
  origin: LatLong,
  bearingRange: [number, number]
): string {
  const points = bearingRange.map((bearing) => [
    origin.degreesEast +
      Math.cos(((90 - bearing) / 180) * Math.PI) * radiusInDegrees,
    origin.degreesNorth +
      Math.sin(((90 - bearing) / 180) * Math.PI) * radiusInDegrees,
  ]);

  const data: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: [
            points[0],
            [origin.degreesEast, origin.degreesNorth],
            points[1],
          ],
          type: "LineString",
        },
        id: 0,
      },
    ],
  };

  return `https://geojson.io/#data=data:application/json,${encodeURIComponent(
    JSON.stringify(data)
  )}&map=2/0/20`;
}
