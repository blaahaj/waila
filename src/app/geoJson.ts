import type { LatLong } from "./LatLong";

export function geoJsonUrl(origin: LatLong, bearing: number): string {
  const data = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: [
            [origin.degreesEast, origin.degreesNorth],
            [
              origin.degreesEast +
                Math.cos(((90 - bearing) / 180) * Math.PI) * 0.5,
              origin.degreesNorth +
                Math.sin(((90 - bearing) / 180) * Math.PI) * 0.5,
            ],
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
