import { Well } from "@zendeskgarden/react-notifications";
import type { Dispatch, SetStateAction } from "react";
import type { Pin } from "./pin";
import { LatLong } from "./LatLong";

function ImportExport({
  pins,
  setPins,
  viewerPositionSpec,
  setViewerPositionSpec,
  viewerPosition,
  setViewerPosition,
}: {
  pins: Pin[];
  setPins: Dispatch<SetStateAction<Pin[]>>;
  viewerPositionSpec: string;
  setViewerPositionSpec: Dispatch<SetStateAction<string>>;
  viewerPosition: LatLong | null;
  setViewerPosition: Dispatch<SetStateAction<LatLong | null>>;
}) {
  return (
    <Well>
      <pre
        onDoubleClick={() => {
          const json = window.prompt("JSON:");
          if (!json) return;

          const data = JSON.parse(json);

          const pos = data.viewerPositionSpec ?? "";
          setViewerPositionSpec(pos);
          setViewerPosition(LatLong.parse(pos));

          data.pins?.forEach((pin: any) => {
            if ("inWorldSpec" in pin) {
              pin.inWorld = LatLong.parse(pin.inWorldSpec);
            }
          });

          setPins(data.pins ?? []);
        }}
      >
        {JSON.stringify(
          {
            viewerPositionSpec,
            pins: pins.map((pin) => ({
              ...pin,
              inWorld: undefined,
              bearing: undefined,
            })),
          },
          null,
          2
        )}
      </pre>
    </Well>
  );
}

export default ImportExport;
