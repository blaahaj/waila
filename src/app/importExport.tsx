import { useMemo, type Dispatch, type SetStateAction } from "react";
import type { ImageItem } from "./imageItem";
import { LatLong } from "./LatLong";
import { Button } from "@zendeskgarden/react-buttons";
import { Grid } from "@zendeskgarden/react-grid";
import { Well } from "@zendeskgarden/react-notifications";
import type { WorldItem } from "./worldItem";

function ImportExport({
  imageItems,
  setImageItems,
  worldItems,
  setWorldItems,
  viewerPositionSpec,
  setViewerPositionSpec,
  setViewerPosition,
}: {
  imageItems: readonly ImageItem[];
  setImageItems: Dispatch<SetStateAction<ImageItem[]>>;
  worldItems: readonly WorldItem[];
  setWorldItems: Dispatch<SetStateAction<WorldItem[]>>;
  viewerPositionSpec: string;
  setViewerPositionSpec: Dispatch<SetStateAction<string>>;
  viewerPosition: LatLong | null;
  setViewerPosition: Dispatch<SetStateAction<LatLong | null>>;
}) {
  const currentData = {
    viewerPositionSpec,
    imageItems,
    worldItems,
  };

  const setData = useMemo(
    () => () => {
      const json = window.prompt("JSON:");
      if (!json) return;

      const data = JSON.parse(json);

      const pos = data.viewerPositionSpec ?? "";
      setViewerPositionSpec(pos);
      setViewerPosition(LatLong.parse(pos));

      setImageItems(data.imageItems ?? []);
      setWorldItems(data.worldItems ?? []);
    },
    [setImageItems, setWorldItems, setViewerPosition, setViewerPositionSpec]
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
