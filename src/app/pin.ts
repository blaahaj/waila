import type { LatLong } from "./LatLong";
import * as regression from "regression";

export interface BasePin<T extends string> {
  readonly type: T;
  readonly id: string;
  readonly label: string;
  readonly inImage: {
    readonly percentX: number;
    readonly percentY: number;
  };
}

export type KnownWorldPositionPin = BasePin<"known-world-position"> & {
  readonly inWorldSpec: string;
  readonly inWorld: LatLong | null;
};

export type ValidKnownWorldPositionPin = KnownWorldPositionPin & {
  readonly inWorld: LatLong;
};

export type KnownImagePositionPin = BasePin<"known-image-position">;

export type Pin = KnownWorldPositionPin | KnownImagePositionPin;

export function isValidKnownPosition(
  pin: Pin
): pin is ValidKnownWorldPositionPin {
  return pin.type === "known-world-position" && pin.inWorld !== null;
}

export function addBearingToKnownImagePosition(
  pin: KnownImagePositionPin,
  regressionResult: regression.Result
): KnownImagePositionPin & { bearing: number } {
  return {
    ...pin,
    bearing: regressionResult.predict(pin.inImage.percentX)[1],
  };
}

export function addBearingToKnownWorldPosition(
  pin: ValidKnownWorldPositionPin,
  origin: LatLong
): ValidKnownWorldPositionPin & { bearing: number } {
  return {
    ...pin,
    bearing:
      90 -
      (Math.atan2(
        pin.inWorld.degreesNorth - origin.degreesNorth,
        pin.inWorld.degreesEast - origin.degreesEast
      ) /
        Math.PI) *
        180,
  };
}
