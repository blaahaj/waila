"use client";

import ImageWithPins from "./ImageWithPins";

export default function ImageOrChooser({
  imageSource,
}: {
  imageSource: string;
}) {
  return (
    <div style={{ width: "60vw", height: "60vh", overflow: "scroll" }}>
      <ImageWithPins imageSource={imageSource} />
    </div>
  );
}
