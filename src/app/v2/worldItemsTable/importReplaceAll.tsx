import { Button } from "@zendeskgarden/react-buttons";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import type { WorldItem } from "../worldItem";
// import { randomUUID } from "crypto";

function ImportReplaceAll({
  setWorldItems,
}: {
  setWorldItems: Dispatch<SetStateAction<WorldItem[]>>;
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
                polygonFeature.properties?.id ??
                polygonFeature.id ??
                `unstable-id:${crypto.randomUUID()}`,
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

  return <Button onClick={setData}>Paste GeoJSON (replace all)</Button>;
}

export default ImportReplaceAll;
