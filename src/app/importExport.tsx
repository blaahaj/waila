import { Well } from "@zendeskgarden/react-notifications";
import type { Dispatch, SetStateAction } from "react";
import type { Pin } from "./withImage";
import type { ParsedLatLong } from "./LatLong";

function ImportExport({
  pins,
  setPins,
  viewerPosition,
  setViewerPosition,
}: {
  pins: Pin[];
  setPins: Dispatch<SetStateAction<Pin[]>>;
  viewerPosition: ParsedLatLong;
  setViewerPosition: Dispatch<SetStateAction<ParsedLatLong>>;
}) {
  return (
    <Well>
      <pre
        onDoubleClick={() => {
          const json = window.prompt("JSON:");
          if (!json) return;

          const data = JSON.parse(json);
          console.log({ data });
          if (data.viewerPosition) setViewerPosition(data.viewerPosition);
          if (data.pins) setPins(data.pins);
        }}
      >
        {JSON.stringify(
          {
            viewerPosition,
            pins,
          },
          null,
          2
        )}
      </pre>
    </Well>
  );
}

export default ImportExport;
