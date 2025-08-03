import { Table } from "@zendeskgarden/react-tables";
import { addBearingsToWorldItem, type WorldItem } from "../worldItem";
import type { LatLong } from "../LatLong";
import { normaliseBearing } from "../bearing";

function WorldItemsTable({
  worldItems,
  viewerPosition,
}: {
  worldItems: readonly WorldItem[];
  viewerPosition: LatLong | null;
}) {
  const sortedItems = worldItems.toSorted((a, b) =>
    a.label.localeCompare(b.label)
  );

  return (
    <Table>
      <Table.Head>
        <Table.HeaderRow>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Bearing range</Table.HeaderCell>
          <Table.HeaderCell>Label</Table.HeaderCell>
        </Table.HeaderRow>
      </Table.Head>
      <Table.Body>
        {sortedItems.map((worldItem) => {
          const bearings = viewerPosition
            ? addBearingsToWorldItem(worldItem, viewerPosition).bearings
            : undefined;

          return (
            <Table.Row key={worldItem.id}>
              <Table.Cell>{worldItem.id}</Table.Cell>
              <Table.Cell>
                {bearings ? (
                  <>
                    {normaliseBearing(bearings.min).toFixed(3)}&deg; –{" "}
                    {normaliseBearing(bearings.max).toFixed(3)}
                    &deg;
                  </>
                ) : null}
              </Table.Cell>
              <Table.Cell>{worldItem.label}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

export default WorldItemsTable;
