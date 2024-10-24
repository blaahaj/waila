import { Grid } from "@zendeskgarden/react-grid";
import { type Dispatch, type SetStateAction, useMemo } from "react";
import type { ImageItem } from "./imageItem";
import ImageItemTableRow from "./imageItemTableRow";
import type { LatLong } from "./LatLong";
import { addBearingsToWorldItem, type WorldItem } from "./worldItem";
import regression from "regression";
import { Option } from "@zendeskgarden/react-dropdowns";
import { addBearingsToImageItem } from "./bearing";

function CombinedItemsTable({
  imageItems,
  setImageItems,
  worldItems,
  viewerPosition,
  regressionResult,
}: {
  imageItems: ImageItem[];
  setImageItems: Dispatch<SetStateAction<ImageItem[]>>;
  worldItems: WorldItem[];
  viewerPosition: LatLong;
  regressionResult: regression.Result;
}) {
  const itemsWithBearings = [
    ...worldItems.map((worldItem) => {
      const t = addBearingsToWorldItem(worldItem, viewerPosition);

      return {
        minBearing: t.bearings.min,
        maxBearing: t.bearings.max,
        type: "world" as const,
        worldItem: t,
      };
    }),
    ...imageItems.map((imageItem) => {
      const t = addBearingsToImageItem(imageItem, regressionResult);

      return {
        minBearing: t.bearings.min,
        maxBearing: t.bearings.max,
        type: "image" as const,
        imageItem,
      };
    }),
  ];

  itemsWithBearings.sort((a, b) => a.minBearing - b.minBearing);

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
              {worldItem.label}
            </Option>
          ))}
        </>
      ),
    [imageItems, worldItems]
  );

  return (
    <>
      <Grid>
        {itemsWithBearings.map((imageOrWorldItem) => {
          if (imageOrWorldItem.type === "image")
            return (
              <ImageItemTableRow
                key={imageOrWorldItem.imageItem.id}
                imageItem={imageOrWorldItem.imageItem}
                setImageItems={setImageItems}
                worldItems={worldItems}
                expandedChildren={expandedChildren}
                viewerPosition={viewerPosition}
                regressionResult={regressionResult ?? null}
              />
            );

          return (
            <Grid.Row>
              <Grid.Col></Grid.Col>
              <Grid.Col></Grid.Col>
              <Grid.Col>{imageOrWorldItem.minBearing.toFixed(3)}&deg;</Grid.Col>
              <Grid.Col>{imageOrWorldItem.maxBearing.toFixed(3)}&deg;</Grid.Col>
              <Grid.Col>TODO geojson</Grid.Col>
              <Grid.Col>{imageOrWorldItem.worldItem.label}</Grid.Col>
            </Grid.Row>
          );
        })}
      </Grid>
    </>
  );
}

export default CombinedItemsTable;
