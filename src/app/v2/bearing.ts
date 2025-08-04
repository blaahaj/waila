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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: regression.Options
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

export type PairOfRegressions = {
  imagePercentXToBearing: {
    inputData: readonly [number, number][];
    result: regression.Result;
  };
  bearingToImagePercentX: {
    inputData: readonly [number, number][];
    result: regression.Result;
  };
};

const TAU = Math.PI * 2;

const findAverageAngle = (items: readonly number[]): number => {
  let x = 0;
  let y = 0;

  for (const item of items) {
    x += Math.cos((item / 360) * TAU);
    y += Math.sin((item / 360) * TAU);
  }

  return (Math.atan2(y, x) / TAU) * 360;
};

const normaliseAngles = (
  items: readonly [number, number][],
  averageAngle: number
): [number, number][] => {
  const low = averageAngle + 3600 + 270;

  return items.map(([imageX, bearing]) => {
    while (bearing < low) bearing += 360;
    return [imageX, bearing];
  });
};

export const normaliseBearing = (n: number) => {
  while (n < 0) n += 360;
  while (n >= 360) n -= 360;
  return n;
};

export function buildRegression(
  origin: LatLong | null,
  pairedItems: readonly PairedItem[],
  fn: typeof regression.linear,
  options?: regression.Options
): PairOfRegressions | null {
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

  const averageBearing = findAverageAngle(dataPoints.map((t) => t[1]));
  const normalisedDataPoints = normaliseAngles(dataPoints, averageBearing);

  const flippedDataPoints: regression.DataPoint[] = normalisedDataPoints.map(
    ([x, bearing]) => [bearing, x]
  );

  return {
    imagePercentXToBearing: {
      inputData: normalisedDataPoints,
      result: fn(normalisedDataPoints, options),
    },
    bearingToImagePercentX: {
      inputData: flippedDataPoints,
      result: fn(flippedDataPoints, options),
    },
  };
}

export function addBearingsToImageItem(
  imageItem: ImageItem,
  pairOfRegressions: PairOfRegressions
): ImageItem & { bearings: { min: number; max: number } } {
  const all = imageItem.rectangle.map(
    (corner) =>
      pairOfRegressions.imagePercentXToBearing.result.predict(
        corner.percentX
      )[1] % 360
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
