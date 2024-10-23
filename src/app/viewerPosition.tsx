import { Anchor } from "@zendeskgarden/react-buttons";
import { Field, Input } from "@zendeskgarden/react-forms";
import { LatLong } from "./LatLong";
import type { Dispatch, SetStateAction } from "react";

function ViewerPosition({
  viewerPositionSpec,
  setViewerPositionSpec,
  viewerPosition,
  setViewerPosition,
}: {
  viewerPositionSpec: string;
  setViewerPositionSpec: Dispatch<SetStateAction<string>>;
  viewerPosition: LatLong | null;
  setViewerPosition: Dispatch<SetStateAction<LatLong | null>>;
}) {
  return (
    <Field>
      <Field.Label>Viewer position</Field.Label>
      <Field.Hint>
        The latitude/longitude from where the picture was taken
      </Field.Hint>
      <Input
        value={viewerPositionSpec}
        onChange={(e) => {
          setViewerPositionSpec(e.currentTarget.value);
          setViewerPosition(LatLong.parse(e.currentTarget.value));
        }}
      />
      {viewerPositionSpec === "" && (
        <Field.Message validation="warning" validationLabel="...">
          Enter a value
        </Field.Message>
      )}
      {viewerPositionSpec !== "" && !viewerPosition && (
        <Field.Message validation="error" validationLabel="...">
          Invalid input
        </Field.Message>
      )}
      {viewerPosition && (
        <Field.Message validation="success" validationLabel="...">
          See this position on{" "}
          <Anchor
            href={`https://geohack.toolforge.org/geohack.php?pagename=Waila&params=${viewerPosition.degreesNorth}_N_${viewerPosition.degreesEast}_E_scale:2500_region:DK`}
            isExternal={false}
          >
            Geohack
          </Anchor>
        </Field.Message>
      )}
    </Field>
  );
}

export default ViewerPosition;
