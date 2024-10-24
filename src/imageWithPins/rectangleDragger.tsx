import type { ImagePosition } from "@/app/imageItem";
import { useMemo, useState, type ReactNode, type RefObject } from "react";

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

function RectangleDragger({
  imageRef,
  onRectangle,
  image,
  children,
}: {
  imageRef: RefObject<HTMLImageElement>;
  onRectangle: (rectangle: [ImagePosition, ImagePosition]) => void;
  image: ReactNode[];
  children?: ReactNode[];
}) {
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

            onRectangle([
              { percentX: x[0], percentY: y[0] },
              { percentX: x[1], percentY: y[1] },
            ]);
          }

          setDrag(undefined);
        },
        [drag]
      )}
    >
      {image}

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

      {children}
    </div>
  );
}

export default RectangleDragger;
