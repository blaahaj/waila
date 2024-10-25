import { Button } from "@zendeskgarden/react-buttons";
import { Grid } from "@zendeskgarden/react-grid";
import { Table } from "@zendeskgarden/react-tables";
import { LatLong } from "./LatLong";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { addBearingsToWorldItem, type WorldItem } from "./worldItem";
import GeoJSON from "geojson";
import { randomUUID } from "crypto";
import { longVee } from "./geoJson";

// const averagePositionOf = (points: LatLong[]): LatLong => {
//   const degreesNorth =
//     points.reduce((acc, item) => acc + item.degreesNorth, 0) / points.length;
//   const degreesEast =
//     points.reduce((acc, item) => acc + item.degreesEast, 0) / points.length;
//   return { degreesNorth, degreesEast };
// };

function WorldItemsTable({
  worldItems,
  setWorldItems,
  viewerPosition,
}: {
  worldItems: readonly WorldItem[];
  setWorldItems: Dispatch<SetStateAction<WorldItem[]>>;
  viewerPosition: LatLong | null;
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
            (polygonFeature): WorldItem => ({
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
    },
    [setWorldItems]
  );

  const addAnItem = useMemo(
    () => () => {
      const json = window.prompt("GeoJSON:");
      if (!json) return;

      const data = JSON.parse(json) as GeoJSON.GeoJSON;

      if (data.type === "Feature" && data.geometry.type === "Polygon") {
        data.properties ||= {};
        data.properties.id ||= randomUUID().toLocaleLowerCase();
        data.properties.label ||= "[unnamed]";

        const newItem: WorldItem = {
          id: data.properties.id,
          label: data.properties.label,
          points: data.geometry.coordinates
            .flat(1)
            .map((c) => ({ degreesEast: c[0], degreesNorth: c[1] })),
          geoJsonFeature: data,
        };

        setWorldItems((current) => [
          ...current.filter((i) => i.id !== newItem.id),
          newItem,
        ]);
      }
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
        <Button onClick={setData}>Paste GeoJSON (replace all)</Button>
        &nbsp;
        <Button onClick={addAnItem}>Paste GeoJSON (add an item)</Button>
        &nbsp;
        <Button
          disabled={!viewerPosition}
          style={{ width: "fit-content" }}
          onClick={async () => {
            const viewer: GeoJSON.Feature = {
              type: "Feature",
              properties: {
                label: "Viewer",
              },
              id: "viewer",
              geometry: {
                type: "Point",
                coordinates: [
                  viewerPosition!.degreesEast,
                  viewerPosition!.degreesNorth,
                ],
              },
            };

            const radialLines = worldItems.flatMap((i) => {
              const bearings = addBearingsToWorldItem(
                i,
                viewerPosition!
              ).bearings;
              return longVee(viewerPosition!, [bearings.min, bearings.max]);
            });

            // const radialLines = worldItems.map(
            //   (i): GeoJSON.Feature => ({
            //     type: "Feature",
            //     properties: {
            //       label: `line to: ${i.label}`,
            //     },
            //     geometry: {
            //       type: "LineString",
            //       coordinates: [
            //         [viewerPosition!.degreesEast, viewerPosition!.degreesNorth],
            //         ...[averagePositionOf(i.points)].map((latlong) => [
            //           latlong.degreesEast,
            //           latlong.degreesNorth,
            //         ]),
            //       ],
            //     },
            //   })
            // );

            const collection: GeoJSON.FeatureCollection = {
              type: "FeatureCollection",
              features: [
                viewer,
                ...worldItems.map((i) => i.geoJsonFeature),
                ...radialLines,
              ],
            };
            const content = JSON.stringify(collection);
            await navigator.clipboard.writeText(content);
          }}
        >
          Copy as GeoJSON with radial lines
        </Button>
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
              const bearings = viewerPosition
                ? addBearingsToWorldItem(worldItem, viewerPosition).bearings
                : undefined;

              return (
                <Table.Row key={worldItem.id}>
                  <Table.Cell>{worldItem.id}</Table.Cell>
                  <Table.Cell>
                    {bearings ? (
                      <>
                        {bearings.min.toFixed(3)}&deg; –{" "}
                        {bearings.max.toFixed(3)}
                        &deg;
                      </>
                    ) : null}
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
