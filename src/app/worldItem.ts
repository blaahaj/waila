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
): WorldItem & { bearings: number[] } {
  const latlongToBearing = (latlong: LatLong): number =>
    90 -
    (Math.atan2(
      latlong.degreesNorth - origin.degreesNorth,
      latlong.degreesEast - origin.degreesEast
    ) /
      Math.PI) *
      180;

  return {
    ...worldItem,
    bearings: worldItem.points.map(latlongToBearing),
  };
}
