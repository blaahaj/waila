import React from "react";

import { useMemo, type Dispatch, type SetStateAction } from "react";
import type { ImageItem } from "./imageItem";
import { Button } from "@zendeskgarden/react-buttons";
import { Grid } from "@zendeskgarden/react-grid";
import { Well } from "@zendeskgarden/react-notifications";
import type { WorldItem } from "./worldItem";

function ImportExport({
  imageItems,
  setImageItems,
  worldItems,
  setWorldItems,
  cameraPosition,
  setCameraPosition,
}: {
  imageItems: readonly ImageItem[];
  setImageItems: Dispatch<SetStateAction<ImageItem[]>>;
  worldItems: readonly WorldItem[];
  setWorldItems: Dispatch<SetStateAction<WorldItem[]>>;
  cameraPosition: readonly [number, number] | undefined;
  setCameraPosition: Dispatch<
    SetStateAction<readonly [number, number] | undefined>
  >;
}) {
  const currentData = {
    cameraPosition: cameraPosition ?? null,
    imageItems,
    worldItems,
  };

  const setData = useMemo(
    () => () => {
      const json = window.prompt("JSON:");
      if (!json) return;

      const data = JSON.parse(json);

      setCameraPosition(data.cameraPosition ?? undefined);
      setImageItems(data.imageItems ?? []);
      setWorldItems(data.worldItems ?? []);
    },
    [setImageItems, setWorldItems, setCameraPosition]
  );

  const content = JSON.stringify(currentData, null, 2);

  return (
    <Grid>
      <Grid.Row>
        <Grid.Col size={2}>
          <Grid>
            <Grid.Row>
              <Grid.Col>
                <Button
                  style={{ width: "6em" }}
                  onClick={async () => {
                    await navigator.clipboard.writeText(content);
                  }}
                >
                  Copy
                </Button>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row style={{ marginTop: "1em" }}>
              <Grid.Col>
                <Button style={{ width: "6em" }} onClick={setData}>
                  Paste
                </Button>
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </Grid.Col>
        <Grid.Col size={8}>
          <Well>
            <pre
              style={{
                maxHeight: "75vh",
                overflow: "scroll",
              }}
            >
              {content}
            </pre>
          </Well>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}

export default ImportExport;
