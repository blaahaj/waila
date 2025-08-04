import * as React from "react";

import { Anchor, Button } from "@zendeskgarden/react-buttons";
import { Field as DField, Combobox } from "@zendeskgarden/react-dropdowns";
import { Input } from "@zendeskgarden/react-forms";
import type { ImageItem } from "./imageItem";
import { useState, type Dispatch, type SetStateAction } from "react";
import { addBearingsToWorldItem, type WorldItem } from "./worldItem";
import type { LatLong } from "./LatLong";
import { addBearingsToImageItem, type PairOfRegressions } from "./bearing";
import { geoJsonUrl } from "./geoJson";
// import { logRender } from "./logRender";
import { Table } from "@zendeskgarden/react-tables";

function ImageItemTableRow({
  imageItem,
  setImageItems,
  worldItems,
  expandedChildren,
  viewerPosition,
  pairOfRegressions,
}: {
  imageItem: ImageItem;
  setImageItems: Dispatch<SetStateAction<ImageItem[]>>;
  worldItems: WorldItem[];
  expandedChildren: (excludeImageItem: ImageItem) => React.ReactNode;
  viewerPosition: LatLong | null;
  pairOfRegressions: PairOfRegressions | null;
}) {
  const [expanded, setExpanded] = useState(false);

  const predictedBearings = pairOfRegressions
    ? addBearingsToImageItem(imageItem, pairOfRegressions).bearings
    : null;

  const worldItem = worldItems.find(
    (wi) => wi.id === imageItem.linkedWorldItemId
  );

  const actualBearings =
    viewerPosition && worldItem
      ? addBearingsToWorldItem(worldItem, viewerPosition).bearings
      : null;

  const delta = (bearing1: number, bearing2: number): number => {
    let d = bearing2 - bearing1;
    while (d < -180) d += 360;
    while (d > +180) d -= 360;
    return d;
  };

  return (
    <Table.Row key={imageItem.id} style={{ marginBottom: "0.5em" }}>
      <Table.Cell style={{ width: "4em" }}>
        {imageItem.rectangle[0].percentX.toFixed(3)}%
      </Table.Cell>
      <Table.Cell style={{ width: "4em" }}>
        {imageItem.rectangle[1].percentX.toFixed(3)}%
      </Table.Cell>

      {(["min", "max"] as const).map((minOrMax) => (
        <Table.Cell key={minOrMax}>
          {predictedBearings && (
            <div>p:{predictedBearings[minOrMax].toFixed(3)}&deg;</div>
          )}
          {/* {actualBearings && (
            <div>a:{actualBearings[minOrMax].toFixed(3)}&deg;</div>
          )} */}
          {actualBearings && predictedBearings && (
            <div>
              a:
              {delta(actualBearings[minOrMax], predictedBearings[minOrMax])
                .toFixed(3)
                .replace(/^(?!-)/, "+")}
              &deg;
            </div>
          )}
        </Table.Cell>
      ))}

      <Table.Cell>
        {viewerPosition && predictedBearings && (
          <Anchor
            isExternal={true}
            href={geoJsonUrl(viewerPosition, [
              predictedBearings.min,
              predictedBearings.max,
            ])}
          >
            Find...
          </Anchor>
        )}
      </Table.Cell>
      <Table.Cell>
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
      </Table.Cell>
      <Table.Cell>
        <DField>
          <Combobox
            listboxAriaLabel="World items"
            isExpanded={expanded}
            style={{ width: expanded ? "20em" : undefined }}
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
      </Table.Cell>
      <Table.Cell>
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
      </Table.Cell>
    </Table.Row>
  );
}

export default ImageItemTableRow;
