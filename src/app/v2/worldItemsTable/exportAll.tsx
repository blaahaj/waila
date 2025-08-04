import * as React from "react";

import { Button } from "@zendeskgarden/react-buttons";
import type { WorldItem } from "../worldItem";
import { generate } from "./generate";

function ExportAll({ worldItems }: { worldItems: readonly WorldItem[] }) {
  return (
    <Button
      style={{ width: "fit-content" }}
      onClick={async () => {
        const featureCollection = generate({
          worldItems,
        });

        await navigator.clipboard.writeText(JSON.stringify(featureCollection));
      }}
    >
      Copy all as GeoJSON
    </Button>
  );
}

export default ExportAll;
