import type { LatLong } from "./LatLong";
import * as regression from "regression";
import { addBearingsToWorldItem, type WorldItem } from "./worldItem";
import type { ImageItem } from "./imageItem";

export interface PairedItem {
  readonly imageItem: ImageItem;
  readonly worldItem: WorldItem;
}

export function naiveLinear(
  dataPoints: readonly regression.DataPoint[],
  _options?: regression.Options
): regression.Result {
  const sorted = dataPoints.toSorted((a, b) => a[0] - b[0]);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const imageXDelta = max[0] - min[0];
  const bearingDelta = max[1] - min[1];

  return {
    predict: (x: number) => [
      x,
      ((x - min[0]) / imageXDelta) * bearingDelta + min[1],
    ],
  } as regression.Result;
}

export const leastSquaresLinear = regression.linear;
export const polynomial = regression.polynomial;

export function buildRegression(
  origin: LatLong | null,
  pairedItems: readonly PairedItem[],
  fn: typeof regression.linear,
  options?: regression.Options
): {
  forwards: regression.Result;
  reverse: regression.Result;
  dataPoints: readonly [number, number][];
} | null {
  if (!origin) return null;
  if (pairedItems.length < 2) return null;

  const dataPoints: regression.DataPoint[] = pairedItems.flatMap((pair) => {
    const imagePercentX = pair.imageItem.rectangle
      .map((p) => p.percentX)
      .sort() as [number, number];

    const bearings = addBearingsToWorldItem(pair.worldItem, origin).bearings;

    return [
      [imagePercentX[0], bearings.min],
      [imagePercentX[1], bearings.max],
    ];
  });

  return {
    forwards: fn(dataPoints, options),
    reverse: fn(dataPoints.map(([x, bearing]) => [bearing, x])),
    dataPoints,
  };
}

export function addBearingsToImageItem(
  imageItem: ImageItem,
  regressionResult: regression.Result
): ImageItem & { bearings: { min: number; max: number } } {
  const all = imageItem.rectangle.map(
    (corner) => regressionResult.predict(corner.percentX)[1]
  );
  const sorted = all.toSorted((a, b) => a - b);

  return {
    ...imageItem,
    bearings: {
      min: sorted[0],
      max: sorted[1],
    },
  };
}
