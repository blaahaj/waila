import { LatLong, type ParsedLatLong } from "./LatLong";
import {
  useRef,
  type Dispatch,
  type MouseEventHandler,
  type SetStateAction,
} from "react";
import type { Pin } from "./withImage";

function ImageWithPins({
  pins,
  setPins,
  imageSource,
  viewerPosition,
}: {
  pins: Pin[];
  setPins: Dispatch<SetStateAction<Pin[]>>;
  imageSource: string;
  viewerPosition: ParsedLatLong;
}) {
  const imageRef = useRef<HTMLImageElement>(null);

  const imageClick: MouseEventHandler<HTMLImageElement> = (event) => {
    const img = imageRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();

    const percentX = ((event.clientX - rect.left) / rect.width) * 100;
    const percentY = ((event.clientY - rect.top) / rect.height) * 100;

    setPins([
      ...pins,
      {
        id: event.timeStamp.toString(),
        label: "unnamed",
        inImage: { percentX, percentY },
        inWorld: LatLong.parse(""),
      },
    ]);
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
          {viewerPosition.latlong && pin.inWorld.latlong && (
            <>
              <br />
              {pin.inWorld.latlong!.degreesNorth.toString()},{"\xA0"}
              {pin.inWorld.latlong!.degreesEast.toString()}
              <br />
              {(
                90 -
                (Math.atan2(
                  pin.inWorld.latlong!.degreesNorth -
                    viewerPosition.latlong!.degreesNorth,
                  pin.inWorld.latlong!.degreesEast -
                    viewerPosition.latlong!.degreesEast
                ) /
                  Math.PI) *
                  180
              ).toPrecision(5)}
              &deg;
            </>
          )}
        </span>
      ))}
    </div>
  );
}

export default ImageWithPins;
