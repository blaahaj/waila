import { Button } from "@zendeskgarden/react-buttons";
import type { WorldItem } from "../worldItem";
import { generate } from "./generate";
import type { LatLong } from "../LatLong";

function ExportAllWithRadialTo({
  worldItems,
  viewerPosition,
}: {
  worldItems: readonly WorldItem[];
  viewerPosition: LatLong | null;
}) {
  return (
    <Button
      disabled={!viewerPosition}
      style={{ width: "fit-content" }}
      onClick={async () => {
        const featureCollection = generate({
          worldItems,
          viewerPosition,
          radialLines: "to-edges",
        });

        await navigator.clipboard.writeText(JSON.stringify(featureCollection));
      }}
    >
      Copy all as GeoJSON with radial lines
    </Button>
  );
}

export default ExportAllWithRadialTo;
