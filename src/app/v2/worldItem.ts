import type { LatLong } from "./LatLong";

export type WorldItem = {
  readonly id: string;
  readonly label: string;
  readonly points: LatLong[];
  readonly geoJsonFeature: GeoJSON.Feature;
};

export type PointAndBearing = {
  readonly latlong: LatLong;
  readonly bearing: number;
};

export type Bearings = {
  readonly all: readonly number[];
  readonly allWithPoints: readonly PointAndBearing[];
  readonly min: number;
  readonly minWithPoint: PointAndBearing;
  readonly max: number;
  readonly maxWithPoint: PointAndBearing;
};

export function addBearingsToWorldItem(
  worldItem: WorldItem,
  origin: LatLong
): WorldItem & { bearings: Bearings } {
  const latlongToBearing = (latlong: LatLong): number =>
    90 -
    (Math.atan2(
      latlong.degreesNorth - origin.degreesNorth,
      latlong.degreesEast - origin.degreesEast
    ) /
      Math.PI) *
      180;

  const pointsWithBearings = worldItem.points.map((latlong) => ({
    latlong,
    bearing: latlongToBearing(latlong),
  }));
  const sorted = pointsWithBearings.toSorted((a, b) => a.bearing - b.bearing);

  return {
    ...worldItem,
    bearings: {
      all: pointsWithBearings.map((pair) => pair.bearing),
      allWithPoints: pointsWithBearings,
      min: sorted[0].bearing,
      minWithPoint: sorted[0],
      max: sorted[sorted.length - 1].bearing,
      maxWithPoint: sorted[sorted.length - 1],
    },
  };
}
