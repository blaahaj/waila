import type { ImageItem } from "@/app/imageItem";
import type { WorldItem } from "@/app/worldItem";
import type { RefObject } from "react";

function Pins({
  imageItems,
  worldItems,
  imageRef,
}: {
  imageItems: ImageItem[];
  worldItems: WorldItem[] | undefined;
  imageRef: RefObject<HTMLImageElement>;
}) {
  return (
    <>
      {imageItems.map((pin) => {
        const worldItem = worldItems?.find(
          (w) => w.id === pin.linkedWorldItemId
        );

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
          </div>
        );
      })}
    </>
  );
}

export default Pins;
