import { Anchor, Button } from "@zendeskgarden/react-buttons";
import { Field as DField, Combobox } from "@zendeskgarden/react-dropdowns";
import { Input } from "@zendeskgarden/react-forms";
import { Grid } from "@zendeskgarden/react-grid";
import type { ImageItem } from "./imageItem";
import { useState, type Dispatch, type SetStateAction } from "react";
import { addBearingsToWorldItem, type WorldItem } from "./worldItem";
import regression from "regression";
import type { LatLong } from "./LatLong";
import { addBearingToImageItem } from "./bearing";
import { geoJsonUrl } from "./geoJson";
import { logRender } from "./logRender";

function ImageItemTableRow({
  imageItem,
  setImageItems,
  worldItems,
  expandedChildren,
  viewerPosition,
  regressionResult,
}: {
  imageItem: ImageItem;
  setImageItems: Dispatch<SetStateAction<ImageItem[]>>;
  worldItems: WorldItem[];
  expandedChildren: (excludeImageItem: ImageItem) => React.ReactNode;
  viewerPosition: LatLong | null;
  regressionResult: regression.Result | null;
}) {
  const [expanded, setExpanded] = useState(false);

  const bearingRange = regressionResult
    ? (addBearingToImageItem(
        imageItem,
        regressionResult
      ).bearing.toSorted() as [number, number])
    : null;

  const worldItem = worldItems.find(
    (wi) => wi.id === imageItem.linkedWorldItemId
  );

  const sortedWorldItemBearings =
    viewerPosition && worldItem
      ? addBearingsToWorldItem(worldItem, viewerPosition).bearings.toSorted(
          (a, b) => a - b
        )
      : undefined;

  return (
    <Grid.Row key={imageItem.id} style={{ marginBottom: "0.5em" }}>
      <Grid.Col size={1}>
        {imageItem.rectangle[0].percentX.toFixed(3)}%
      </Grid.Col>
      <Grid.Col size={1}>
        {imageItem.rectangle[1].percentX.toFixed(3)}%
      </Grid.Col>
      <Grid.Col>
        {sortedWorldItemBearings ? (
          <>{sortedWorldItemBearings[0].toFixed(3)}&deg;</>
        ) : bearingRange ? (
          <>{bearingRange[0].toFixed(3)}&deg;</>
        ) : (
          ""
        )}
      </Grid.Col>
      <Grid.Col>
        {sortedWorldItemBearings ? (
          <>
            {sortedWorldItemBearings[
              sortedWorldItemBearings.length - 1
            ].toFixed(3)}
            &deg;
          </>
        ) : bearingRange ? (
          <>{bearingRange[1].toFixed(3)}&deg;</>
        ) : (
          ""
        )}
      </Grid.Col>
      <Grid.Col>
        {viewerPosition && bearingRange && (
          <Anchor
            isExternal={true}
            href={geoJsonUrl(viewerPosition, bearingRange)}
          >
            Show in GeoJSON
          </Anchor>
        )}
      </Grid.Col>
      <Grid.Col size={4}>
        <Input
          value={imageItem.label}
          onChange={(event) =>
            setImageItems((imageItems) =>
              imageItems.map((p) =>
                p === imageItem
                  ? { ...imageItem, label: event.target.value }
                  : p
              )
            )
          }
          size={20}
          width={"10em"}
        />
      </Grid.Col>
      <Grid.Col>
        <DField>
          <Combobox
            isEditable={false}
            inputValue={imageItem.linkedWorldItemId ?? ""}
            renderValue={() =>
              worldItems.find((wi) => wi.id === imageItem.linkedWorldItemId)
                ?.label ?? "-"
            }
            onChange={({ isExpanded, selectionValue }) => {
              console.log(event);

              if (isExpanded !== undefined) {
                setExpanded(isExpanded);
              }

              if (selectionValue !== undefined) {
                setImageItems((imageItems) =>
                  imageItems.map((item) =>
                    item === imageItem
                      ? {
                          ...imageItem,
                          linkedWorldItemId: selectionValue as string,
                        }
                      : item
                  )
                );
              }
            }}
          >
            {expanded && expandedChildren(imageItem)}
          </Combobox>
        </DField>
      </Grid.Col>
      <Grid.Col>
        <Button
          onClick={() =>
            setImageItems((imageItems) =>
              imageItems.filter((p) => p !== imageItem)
            )
          }
          isDanger={true}
        >
          Remove
        </Button>
      </Grid.Col>
    </Grid.Row>
  );
}

export default logRender(ImageItemTableRow);
