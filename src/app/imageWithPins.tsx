import {
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { type ImageItem, type ImagePosition } from "./imageItem";
import type { WorldItem } from "./worldItem";
import Pins from "@/imageWithPins/pins";
import type { LatLong } from "./LatLong";
import type { PairOfRegressions } from "./bearing";

type RectangleDragState =
  | {
      readonly state: "pre";
      readonly startTime: number;
      readonly startPosition: ImagePosition;
    }
  | {
      readonly state: "dragging";
      readonly startPosition: ImagePosition;
      readonly endPosition: ImagePosition;
    };

function ImageWithPins({
  imageItems,
  setImageItems,
  imageSource,
  worldItems,
  pairOfRegressions,
  viewerPosition,
}: {
  imageItems: ImageItem[];
  setImageItems: Dispatch<SetStateAction<ImageItem[]>>;
  imageSource: string;
  worldItems?: WorldItem[];
  pairOfRegressions: PairOfRegressions | null;
  viewerPosition: LatLong | null;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [showPredictedPositions, setShowPredictedPositions] = useState(false);

  const [drag, setDrag] = useState<RectangleDragState>();

  return (
    <div
      style={{
        position: "relative",
        width: "90vw",
        height: "75vh",
        overflow: "scroll",
      }}
      // onClickCapture={useMemo(() => event => {}, [])}
      onKeyDownCapture={useMemo(
        () => (event) => {
          console.log(event);
          if (event.key === "Alt") setShowPredictedPositions(true);
        },
        [setShowPredictedPositions]
      )}
      onKeyUpCapture={useMemo(
        () => (event) => {
          console.log(event);
          if (event.key === "Alt") setShowPredictedPositions(false);
        },
        [setShowPredictedPositions]
      )}
      onMouseDownCapture={useMemo(
        () => (event) => {
          if (!imageRef.current) return;

          if (drag === undefined) {
            const rect = imageRef.current.getBoundingClientRect();
            const percentX = ((event.clientX - rect.left) / rect.width) * 100;
            const percentY = ((event.clientY - rect.top) / rect.height) * 100;

            setDrag({
              state: "pre",
              startTime: new Date().getTime(),
              startPosition: { percentX, percentY },
            });
          }
        },
        [drag]
      )}
      onMouseMoveCapture={useMemo(
        () => (event) => {
          if (!imageRef.current) return;

          const rect = imageRef.current.getBoundingClientRect();
          const percentX = ((event.clientX - rect.left) / rect.width) * 100;
          const percentY = ((event.clientY - rect.top) / rect.height) * 100;

          if (drag?.state === "pre") {
            if (new Date().getTime() - drag.startTime > 0.2) {
              setDrag({
                ...drag,
                state: "dragging",
                endPosition: { percentX, percentY },
              });
            }
          } else if (drag?.state === "dragging") {
            setDrag({
              ...drag,
              endPosition: { percentX, percentY },
            });
          }
        },
        [drag]
      )}
      onMouseUpCapture={useMemo(
        () => (event) => {
          if (!imageRef.current) return;

          if (drag?.state === "dragging") {
            const rect = imageRef.current.getBoundingClientRect();
            const percentX = ((event.clientX - rect.left) / rect.width) * 100;
            const percentY = ((event.clientY - rect.top) / rect.height) * 100;

            const x = [drag.startPosition.percentX, percentX].toSorted(
              (a, b) => a - b
            );
            const y = [drag.startPosition.percentY, percentY].toSorted(
              (a, b) => a - b
            );

            const newImageItem: ImageItem = {
              id: event.timeStamp.toString(),
              label: `${Math.floor(Math.random() * 10000)} unnamed`,
              rectangle: [
                { percentX: x[0], percentY: y[0] },
                { percentX: x[1], percentY: y[1] },
              ],
              linkedWorldItemId: null,
            };

            setImageItems([...imageItems, newImageItem]);
          }

          setDrag(undefined);
        },
        [drag, imageItems, setImageItems]
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={imageSource}
        className="App-logo"
        alt="provided image"
        // onDoubleClick={imageClick}
        style={{
          minWidth: "fit-content",
          minHeight: "fit-content",
        }}
        draggable={false}
      />

      {drag?.state === "dragging" &&
        (() => {
          const x = [
            drag.startPosition.percentX,
            drag.endPosition.percentX,
          ].toSorted((a, b) => a - b);
          const y = [
            drag.startPosition.percentY,
            drag.endPosition.percentY,
          ].toSorted((a, b) => a - b);

          return (
            <div
              style={{
                position: "absolute",
                left: `${
                  (imageRef.current!.offsetWidth * x[0]) / 100 +
                  imageRef.current!.offsetLeft
                }px`,
                top: `${
                  (imageRef.current!.offsetHeight * y[0]) / 100 +
                  imageRef.current!.offsetTop
                }px`,
                width: `${
                  ((x[1] - x[0]) / 100) * imageRef.current!.offsetWidth
                }px`,
                height: `${
                  ((y[1] - y[0]) / 100) * imageRef.current!.offsetHeight
                }px`,
                border: "1px dashed red",
              }}
            ></div>
          );
        })()}

      <Pins
        imageItems={imageItems}
        worldItems={worldItems}
        imageRef={imageRef}
        showPredictedPositions={showPredictedPositions}
        pairOfRegressions={pairOfRegressions}
        viewerPosition={viewerPosition}
      />
    </div>
  );
}

export default ImageWithPins;
