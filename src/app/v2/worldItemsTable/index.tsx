import { Grid } from "@zendeskgarden/react-grid";
import WorldItemsTableExtracted from "./table";
import { LatLong } from "../LatLong";
import { type Dispatch, type SetStateAction } from "react";
import { type WorldItem } from "../worldItem";
import ImportReplaceAll from "./importReplaceAll";
import ImportMerge from "./importMerge";
import ExportAll from "./exportAll";
import ExportAllWithRadialTo from "./exportAllWithRadialTo";

function WorldItemsTable({
  worldItems,
  setWorldItems,
  viewerPosition,
}: {
  worldItems: readonly WorldItem[];
  setWorldItems: Dispatch<SetStateAction<WorldItem[]>>;
  viewerPosition: LatLong | null;
}) {
  return (
    <Grid>
      <Grid.Row>
        <Grid>
          <Grid.Row>
            <Grid.Col>
              <ImportReplaceAll setWorldItems={setWorldItems} />
            </Grid.Col>
            <Grid.Col>
              <ImportMerge setWorldItems={setWorldItems} />
            </Grid.Col>
            <Grid.Col>
              <ExportAll worldItems={worldItems} />
            </Grid.Col>
            <Grid.Col>
              <ExportAllWithRadialTo
                worldItems={worldItems}
                viewerPosition={viewerPosition}
              />
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Grid.Row>
      <Grid.Row style={{ marginTop: "1em" }}>
        <WorldItemsTableExtracted
          worldItems={worldItems}
          viewerPosition={viewerPosition}
        />
      </Grid.Row>
    </Grid>
  );
}

export default WorldItemsTable;
