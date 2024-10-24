import { Option } from "@zendeskgarden/react-dropdowns";
import { Grid } from "@zendeskgarden/react-grid";
import { LatLong } from "./LatLong";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { type ImageItem } from "./imageItem";
import regression from "regression";
import { addBearingsToWorldItem, type WorldItem } from "./worldItem";
import ImageItemTableRow from "./imageItemTableRow";
import { Table } from "@zendeskgarden/react-tables";

function ImageItemsTable({
  imageItems,
  setImageItems,
  worldItems,
  viewerPosition,
  regressionResult,
}: {
  imageItems: ImageItem[];
  setImageItems: Dispatch<SetStateAction<ImageItem[]>>;
  worldItems: WorldItem[];
  viewerPosition: LatLong | null;
  regressionResult: regression.Result | null;
}) {
  if (viewerPosition) {
    const withBearings = worldItems
      .map((item) => addBearingsToWorldItem(item, viewerPosition))
      .sort((a, b) => a.bearings.min - b.bearings.min);
    worldItems = withBearings;
  }

  const expandedChildren = useMemo(
    () => (excludedItem: ImageItem) =>
      (
        <>
          <Option value="">[no linked World Item]</Option>
          {worldItems.map((worldItem) => (
            <Option
              key={worldItem.id}
              value={worldItem.id}
              label={worldItem.label}
              isDisabled={imageItems.some(
                (imageItem) =>
                  imageItem.linkedWorldItemId === worldItem.id &&
                  imageItem !== excludedItem
              )}
            >
              {"bearings" in worldItem ? (
                <>
                  {(worldItem.bearings as { min: number }).min.toFixed(3)}&deg;{" "}
                </>
              ) : null}
              {worldItem.label}
            </Option>
          ))}
        </>
      ),
    [viewerPosition, imageItems, worldItems, new Date().getTime()]
  );

  return (
    <Table>
      <Table.Head>
        <Table.HeaderRow>
          <Table.HeaderCell>min x%</Table.HeaderCell>
          <Table.HeaderCell>max x%</Table.HeaderCell>
          <Table.HeaderCell>min bearing</Table.HeaderCell>
          <Table.HeaderCell>max bearing</Table.HeaderCell>
          <Table.HeaderCell>GeoJSON</Table.HeaderCell>
          <Table.HeaderCell>Label</Table.HeaderCell>
          <Table.HeaderCell>Linked world item</Table.HeaderCell>
        </Table.HeaderRow>
      </Table.Head>
      <Table.Body>
        {imageItems
          .sort((a, b) => a.rectangle[0].percentX - b.rectangle[0].percentX)
          .map((imageItem) => {
            return (
              <ImageItemTableRow
                key={imageItem.id}
                imageItem={imageItem}
                setImageItems={setImageItems}
                worldItems={worldItems}
                expandedChildren={expandedChildren}
                viewerPosition={viewerPosition}
                regressionResult={regressionResult ?? null}
              />
            );
          })}
      </Table.Body>
    </Table>
  );
}

export default ImageItemsTable;
