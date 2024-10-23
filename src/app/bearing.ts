import type { LatLong } from "./LatLong";
import * as regression from "regression";
import { addBearingsToWorldItem, type WorldItem } from "./worldItem";
import type { ImageItem } from "./imageItem";

export interface PairedItem {
  readonly imageItem: ImageItem;
  readonly worldItem: WorldItem;
}

export function naiveLinear(
  dataPoints: regression.DataPoint[],
  _options?: regression.Options
): regression.Result {
  const sorted = dataPoints.sort((a, b) => a[0] - b[0]);
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

export function buildRegression(
  origin: LatLong | null,
  pairedItems: readonly PairedItem[],
  fn: typeof regression.linear,
  options?: regression.Options
): regression.Result | null {
  if (!origin) return null;
  if (pairedItems.length < 2) return null;

  const dataPoints: regression.DataPoint[] = pairedItems.flatMap((pair) => {
    const imagePercentX = pair.imageItem.rectangle
      .map((p) => p.percentX)
      .sort() as [number, number];
    const bearings = addBearingsToWorldItem(
      pair.worldItem,
      origin
    ).bearings.sort((a, b) => a - b);

    return [
      [imagePercentX[0], bearings[0]],
      [imagePercentX[1], bearings[bearings.length - 1]],
    ];
  });

  return fn(dataPoints, options);
}

export function addBearingToImageItem(
  imageItem: ImageItem,
  regressionResult: regression.Result
): ImageItem & { bearing: [number, number] } {
  return {
    ...imageItem,
    bearing: [
      regressionResult.predict(imageItem.rectangle[0].percentX)[1],
      regressionResult.predict(imageItem.rectangle[1].percentX)[1],
    ],
  };
}
