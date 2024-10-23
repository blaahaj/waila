import {
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { type ImageItem, type ImagePosition } from "./imageItem";

type RectangleDragState =
  | {
      state: "pre";
      startTime: number;
      startPosition: ImagePosition;
    }
  | {
      state: "dragging";
      startPosition: ImagePosition;
      endPosition: ImagePosition;
    };

function ImageWithPins({
  imageItems,
  setImageItems,
  imageSource,
}: //   viewerPosition,
//   regressionResult,
{
  imageItems: ImageItem[];
  setImageItems: Dispatch<SetStateAction<ImageItem[]>>;
  imageSource: string;
  //   viewerPosition: LatLong | null;
  //   regressionResult: regression.Result | null;
}) {
  const imageRef = useRef<HTMLImageElement>(null);

  const [drag, setDrag] = useState<RectangleDragState>();

  return (
    <div
      style={{
        position: "relative",
        width: "90vw",
        height: "75vh",
        overflow: "scroll",
      }}
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

            console.log("Rectangle drag:", x, y);

            const newImageItem: ImageItem = {
              id: event.timeStamp.toString(),
              label: `[unnamed ${new Date().toISOString()}]`,
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
        [drag]
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

      {imageItems.map((pin) => {
        return (
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
              color: "white",
              writingMode: "sideways-lr",
              overflow: "visible",
              whiteSpace: "pre",
              textWrap: "nowrap",
            }}
          >
            {pin.label}
          </div>
        );
      })}
    </div>
  );
}

export default ImageWithPins;
