import { Anchor, Button } from "@zendeskgarden/react-buttons";
import { Field as DField, Combobox } from "@zendeskgarden/react-dropdowns";
import { Input } from "@zendeskgarden/react-forms";
import { Grid } from "@zendeskgarden/react-grid";
import type { ImageItem } from "./imageItem";
import { useState, type Dispatch, type SetStateAction } from "react";
import { addBearingsToWorldItem, type WorldItem } from "./worldItem";
import regression from "regression";
import type { LatLong } from "./LatLong";
import { addBearingsToImageItem } from "./bearing";
import { geoJsonUrl } from "./geoJson";
import { logRender } from "./logRender";
import { Table } from "@zendeskgarden/react-tables";

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

  const predictedBearings = regressionResult
    ? addBearingsToImageItem(imageItem, regressionResult).bearings
    : null;

  const worldItem = worldItems.find(
    (wi) => wi.id === imageItem.linkedWorldItemId
  );

  const actualBearings =
    viewerPosition && worldItem
      ? addBearingsToWorldItem(worldItem, viewerPosition).bearings
      : null;

  return (
    <Table.Row key={imageItem.id} style={{ marginBottom: "0.5em" }}>
      <Table.Cell>{imageItem.rectangle[0].percentX.toFixed(3)}%</Table.Cell>
      <Table.Cell>{imageItem.rectangle[1].percentX.toFixed(3)}%</Table.Cell>

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
              {actualBearings[minOrMax] >= predictedBearings[minOrMax]
                ? "+"
                : "-"}
              {Math.abs(
                actualBearings[minOrMax] - predictedBearings[minOrMax]
              ).toFixed(3)}
              &deg;
            </div>
          )}

          {/* {actualBearings ? (
            <>
              p:{actualBearings[minOrMax].toFixed(3)}&deg;
              {predictedBearings && (
                <>
                  {" "}
                  (p=
                  {predictedBearings[minOrMax] >= actualBearings[minOrMax]
                    ? "+"
                    : "-"}
                  {Math.abs(
                    predictedBearings[minOrMax] - actualBearings[minOrMax]
                  ).toFixed(3)}
                  &deg;)
                </>
              )}
            </>
          ) : predictedBearings ? (
            <>p:{predictedBearings[minOrMax].toFixed(3)}&deg;</>
          ) : (
            <></>
          )} */}
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
            Show in GeoJSON
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
            style={{ width: "20em" }}
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

export default logRender(ImageItemTableRow);
