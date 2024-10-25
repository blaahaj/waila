import type { PairOfRegressions } from "@/app/bearing";
import type { ImageItem } from "@/app/imageItem";
import type { LatLong } from "@/app/LatLong";
import { addBearingsToWorldItem, type WorldItem } from "@/app/worldItem";
import type { RefObject } from "react";

function Pins({
  imageItems,
  worldItems,
  imageRef,
  showPredictedPositions,
  pairOfRegressions,
  viewerPosition,
}: {
  imageItems: ImageItem[];
  worldItems: WorldItem[] | undefined;
  imageRef: RefObject<HTMLImageElement>;
  showPredictedPositions: boolean;
  pairOfRegressions: PairOfRegressions | null;
  viewerPosition: LatLong | null;
}) {
  return (
    <>
      {imageItems.flatMap((pin) => {
        const worldItem = worldItems?.find(
          (w) => w.id === pin.linkedWorldItemId
        );
        // if (!worldItem) return null;

        const worldItemWithBearings =
          worldItem && viewerPosition
            ? addBearingsToWorldItem(worldItem, viewerPosition)
            : null;

        return [
          <div
            key={pin.id}
            style={{
              position: "absolute",
              left: `${
                (imageRef.current!.offsetWidth * pin.rectangle[0].percentX) /
                  100 +
                imageRef.current!.offsetLeft
              }px`,
              top: `${
                (imageRef.current!.offsetHeight * pin.rectangle[0].percentY) /
                  100 +
                imageRef.current!.offsetTop
              }px`,
              width: `${
                ((pin.rectangle[1].percentX - pin.rectangle[0].percentX) /
                  100) *
                imageRef.current!.offsetWidth
              }px`,
              height: `${
                ((pin.rectangle[1].percentY - pin.rectangle[0].percentY) /
                  100) *
                imageRef.current!.offsetHeight
              }px`,
              // backgroundColor: "rgba(0, 0, 200, 0.25)",
              border: `1px dashed ${pin.linkedWorldItemId ? "lime" : "yellow"}`,
              color: "black",
              writingMode: "sideways-lr",
              //   paddingInlineStart: "5em",
              overflow: "visible",
              whiteSpace: "pre",
              textWrap: "nowrap",
              fontSize: "smaller",
              textAlign: "center",
            }}
          >
            <span
              style={{
                position: "relative",
                left: "-1em",
                paddingInlineStart: "5em",
              }}
            >
              {worldItem ? worldItem.label : pin.label}
            </span>
          </div>,
          ...(showPredictedPositions &&
          worldItemWithBearings &&
          pairOfRegressions
            ? [
                <div
                  key={"predicted-" + pin.id}
                  style={{
                    position: "absolute",
                    left: `${
                      (imageRef.current!.offsetWidth *
                        pairOfRegressions!.bearingToImagePercentX.result.predict(
                          worldItemWithBearings.bearings.min
                        )[1]) /
                        100 +
                      imageRef.current!.offsetLeft
                    }px`,
                    top: `${
                      (imageRef.current!.offsetHeight *
                        pin.rectangle[0].percentY) /
                        100 +
                      imageRef.current!.offsetTop
                    }px`,
                    width: `${
                      ((pairOfRegressions!.bearingToImagePercentX.result.predict(
                        worldItemWithBearings.bearings.max
                      )[1] -
                        pairOfRegressions!.bearingToImagePercentX.result.predict(
                          worldItemWithBearings.bearings.min
                        )[1]) /
                        100) *
                      imageRef.current!.offsetWidth
                    }px`,
                    height: `${
                      ((pin.rectangle[1].percentY - pin.rectangle[0].percentY) /
                        100) *
                      imageRef.current!.offsetHeight
                    }px`,
                    // backgroundColor: "rgba(0, 0, 200, 0.25)",
                    border: `1px dashed cyan`,
                    color: "black",
                    writingMode: "sideways-lr",
                    //   paddingInlineStart: "5em",
                    overflow: "visible",
                    whiteSpace: "pre",
                    textWrap: "nowrap",
                    fontSize: "smaller",
                    textAlign: "center",
                  }}
                ></div>,
              ]
            : []),
        ];
      })}
    </>
  );
}

export default Pins;
