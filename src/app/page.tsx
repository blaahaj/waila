"use client";
import { DEFAULT_THEME, ThemeProvider } from "@zendeskgarden/react-theming";
import WithImage from "./withImage";
import WithoutImage from "./withoutImage";
import { useState } from "react";

export default function Home() {
  const [imageSource, setImageSource] = useState<string>();

  return (
    <ThemeProvider theme={DEFAULT_THEME}>
      {imageSource ? (
        <WithImage
          imageSource={imageSource}
          clearImage={() => setImageSource(undefined)}
        />
      ) : (
        <WithoutImage setImageSource={setImageSource} />
      )}
    </ThemeProvider>
  );
}
