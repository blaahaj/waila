import { LatLong } from "./LatLong";
import {
  useRef,
  type Dispatch,
  type MouseEventHandler,
  type SetStateAction,
} from "react";
import * as regression from "regression";
import {
  addBearingToKnownImagePosition,
  addBearingToKnownWorldPosition,
  isValidKnownPosition,
  type KnownImagePositionPin,
  type Pin,
} from "./pin";

function ImageWithPins({
  pins,
  setPins,
  imageSource,
  viewerPosition,
  regressionResult,
}: {
  pins: Pin[];
  setPins: Dispatch<SetStateAction<Pin[]>>;
  imageSource: string;
  viewerPosition: LatLong | null;
  regressionResult: regression.Result | null;
}) {
  const imageRef = useRef<HTMLImageElement>(null);

  const imageClick: MouseEventHandler<HTMLImageElement> = (event) => {
    const img = imageRef.current;
    if (!img) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const rect = img.getBoundingClientRect();

    const percentX = ((event.clientX - rect.left) / rect.width) * 100;
    const percentY = ((event.clientY - rect.top) / rect.height) * 100;

    if (event.shiftKey) {
      if (viewerPosition) {
        const pin: KnownImagePositionPin = {
          type: "known-image-position",
          id: event.timeStamp.toString(),
          label: "unknown",
          inImage: { percentX, percentY },
        };

        setPins([...pins, pin]);
      }
    } else {
      setPins([
        ...pins,
        {
          type: "known-world-position",
          id: event.timeStamp.toString(),
          label: "unnamed",
          inImage: { percentX, percentY },
          inWorldSpec: "",
          inWorld: null,
        },
      ]);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "90vw",
        height: "75vh",
        overflow: "scroll",
      }}
      onResize={() => setPins((old) => old)}
      onScroll={() => setPins((old) => old)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={imageSource}
        className="App-logo"
        alt="provided image"
        onDoubleClick={imageClick}
        style={{
          minWidth: "fit-content",
          minHeight: "fit-content",
        }}
      />

      {pins.map((pin) => (
        <span
          key={pin.id}
          style={{
            position: "absolute",
            left: `${
              (imageRef.current!.offsetWidth * pin.inImage.percentX) / 100 +
              imageRef.current!.offsetLeft
            }px`,
            top: `${
              (imageRef.current!.offsetHeight * pin.inImage.percentY) / 100 +
              imageRef.current!.offsetTop
            }px`,
            color: "white",
            padding: "0.3em",
            backgroundColor: "rgba(90, 90, 90, 0.7)",
            borderTop: "1px solid white",
            borderLeft: "1px solid white",
          }}
        >
          {pin.label}
          {viewerPosition && isValidKnownPosition(pin) && (
            <>
              <br />
              {pin.inWorld.degreesNorth.toString()},{"\xA0"}
              {pin.inWorld.degreesEast.toString()}
              <br />
              {addBearingToKnownWorldPosition(
                pin,
                viewerPosition
              ).bearing.toPrecision(8)}
              &deg;
              {regressionResult && (
                <>
                  <br />(
                  {regressionResult
                    .predict(pin.inImage.percentX)[1]
                    .toPrecision(8)}
                  &deg;)
                </>
              )}
            </>
          )}
          {pin.type === "known-image-position" && (
            <>
              <br />
              {regressionResult ? (
                <>
                  {addBearingToKnownImagePosition(
                    pin,
                    regressionResult
                  ).bearing.toPrecision(8)}
                  &deg;
                </>
              ) : (
                "?"
              )}
            </>
          )}
        </span>
      ))}
    </div>
  );
}

export default ImageWithPins;
