import { Option } from "@zendeskgarden/react-dropdowns";
import { Grid } from "@zendeskgarden/react-grid";
import { LatLong } from "./LatLong";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { type ImageItem } from "./imageItem";
import regression from "regression";
import type { WorldItem } from "./worldItem";
import ImageItemTableRow from "./imageItemTableRow";

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
    <Grid>
      {imageItems.map((imageItem) => {
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
    </Grid>
  );
}

export default ImageItemsTable;
