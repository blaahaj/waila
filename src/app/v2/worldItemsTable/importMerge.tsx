import { Button } from "@zendeskgarden/react-buttons";
import { randomUUID } from "crypto";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import type { WorldItem } from "../worldItem";

function ImportMerge({
  setWorldItems,
}: {
  setWorldItems: Dispatch<SetStateAction<WorldItem[]>>;
}) {
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

  return <Button onClick={addAnItem}>Paste GeoJSON (add an item)</Button>;
}

export default ImportMerge;
