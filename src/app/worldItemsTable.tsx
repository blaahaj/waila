import { Button } from "@zendeskgarden/react-buttons";
import { Grid } from "@zendeskgarden/react-grid";
import { Table } from "@zendeskgarden/react-tables";
import { LatLong } from "./LatLong";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import regression from "regression";
import { addBearingsToWorldItem, type WorldItem } from "./worldItem";
import GeoJSON from "geojson";
import { randomUUID } from "crypto";

function WorldItemsTable({
  worldItems,
  setWorldItems,
  viewerPosition,
}: {
  worldItems: readonly WorldItem[];
  setWorldItems: Dispatch<SetStateAction<WorldItem[]>>;
  viewerPosition: LatLong | null;
  regressionResult: regression.Result | null;
}) {
  const setData = useMemo(
    () => () => {
      const json = window.prompt("GeoJSON:");
      if (!json) return;

      const data = JSON.parse(json) as GeoJSON.GeoJSON;

      if (data.type === "FeatureCollection") {
        const polygonFeatures = data.features.filter(
          (feature): feature is GeoJSON.Feature<GeoJSON.Polygon> =>
            feature.geometry.type === "Polygon"
        );

        setWorldItems(
          polygonFeatures.map(
            (polygonFeature, index): WorldItem => ({
              id:
                polygonFeature.properties?.id ?? `unstable-id:${randomUUID()}`,
              label: polygonFeature.properties?.label ?? "[unnamed]",
              points: polygonFeature.geometry.coordinates
                .flat(1)
                .map((eastNorth) => ({
                  degreesNorth: eastNorth[1],
                  degreesEast: eastNorth[0],
                })),
              geoJsonFeature: polygonFeature,
            })
          )
        );
      } else {
        setWorldItems([]);
      }
      data.type;
    },
    [setWorldItems]
  );

  const sortedItems = worldItems.toSorted(
    // (a, b) => a.points[0].degreesEast - b.points[0].degreesEast
    (a, b) => a.label.localeCompare(b.label)
  );

  return (
    <Grid>
      <Grid.Row>
        <Button onClick={setData}>Paste GeoJSON</Button>
      </Grid.Row>
      <Grid.Row style={{ marginTop: "1em" }}>
        <Table>
          <Table.Head>
            <Table.HeaderRow>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Bearing range</Table.HeaderCell>
              <Table.HeaderCell>Label</Table.HeaderCell>
            </Table.HeaderRow>
          </Table.Head>
          <Table.Body>
            {sortedItems.map((worldItem) => {
              const sortedBearings = viewerPosition
                ? addBearingsToWorldItem(
                    worldItem,
                    viewerPosition
                  ).bearings.toSorted((a, b) => a - b)
                : undefined;

              return (
                <Table.Row key={worldItem.id}>
                  <Table.Cell>{worldItem.id}</Table.Cell>
                  <Table.Cell>
                    {sortedBearings && sortedBearings.length > 0 && (
                      <>
                        {sortedBearings[0].toFixed(3)}&deg; –{" "}
                        {sortedBearings[sortedBearings.length - 1].toFixed(3)}
                        &deg;
                      </>
                    )}
                  </Table.Cell>
                  <Table.Cell>{worldItem.label}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Grid.Row>
    </Grid>
  );
}

export default WorldItemsTable;
