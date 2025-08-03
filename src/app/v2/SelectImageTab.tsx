"use client";

import { Button } from "@zendeskgarden/react-buttons";
import { Grid } from "@zendeskgarden/react-grid";
import { useMemo, useState } from "react";
import FileUploader from "./FileUploader";
import LocalStorageChooser from "./LocalStorageChooser";
import { Well } from "@zendeskgarden/react-notifications";

export default function SelectImageTab({
  imageSource,
  setImageSource,
}: {
  imageSource: string | undefined;
  setImageSource: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const clearImage = useMemo(
    () => () =>
      navigator.storage.getDirectory().then(() => setImageSource(undefined)),
    [setImageSource]
  );

  const [key, setKey] = useState(0);
  const reloadList = useMemo(() => () => setKey((prev) => prev + 1), []);

  return (
    <Grid>
      <Grid.Row style={{ padding: "1em" }}>
        <Well>
          <Well.Title>Providing an image</Well.Title>
          <Well.Paragraph>
            You can provide an image by doing any of:
          </Well.Paragraph>
          {/* <Well.Paragraph> */}
          <div>
            <ul style={{ listStylePosition: "inside", listStyleType: "disc" }}>
              <li>uploading an image file from your computer</li>
              <li>dragging and dropping an image file onto this page</li>
              <li>pasting an image into this page</li>
              <li>selecting a previously-provided image from the list below</li>
            </ul>
          </div>
          {/* </Well.Paragraph> */}
        </Well>
      </Grid.Row>
      <Grid.Row style={{ padding: "1em" }}>
        <FileUploader setImageSource={setImageSource} reloadList={reloadList} />
      </Grid.Row>
      <Grid.Row style={{ padding: "1em" }}>
        <LocalStorageChooser
          setImageSource={setImageSource}
          key={key}
          reloadList={reloadList}
        />
      </Grid.Row>
      <Grid.Row style={{ padding: "1em" }}>
        <Button
          onClick={clearImage}
          isDanger={true}
          disabled={imageSource === undefined}
        >
          Deselect image
        </Button>
      </Grid.Row>
    </Grid>
  );
}
