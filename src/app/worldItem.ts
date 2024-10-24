import type { LatLong } from "./LatLong";

export type WorldItem = {
  readonly id: string;
  readonly label: string;
  readonly points: LatLong[];
  geoJsonFeature: GeoJSON.Feature;
};

export function addBearingsToWorldItem(
  worldItem: WorldItem,
  origin: LatLong
): WorldItem & { bearings: { all: number[]; min: number; max: number } } {
  const latlongToBearing = (latlong: LatLong): number =>
    90 -
    (Math.atan2(
      latlong.degreesNorth - origin.degreesNorth,
      latlong.degreesEast - origin.degreesEast
    ) /
      Math.PI) *
      180;

  const bearings = worldItem.points.map(latlongToBearing);
  const sorted = bearings.toSorted((a, b) => a - b);

  return {
    ...worldItem,
    bearings: {
      all: bearings,
      min: sorted[0],
      max: sorted[sorted.length - 1],
    },
  };
}
