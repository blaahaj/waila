import type { FeatureCollection } from "geojson";
import { latlongToGeoJsonPosition, type LatLong } from "../LatLong";
import { addBearingsToWorldItem, type WorldItem } from "../worldItem";
import { longVee } from "../geoJson";

export type RadialLines = "none" | "to-edges" | "beyond-edges";

export const generate = ({
  worldItems,
  viewerPosition,
  radialLines,
}: {
  readonly worldItems: readonly WorldItem[];
  readonly viewerPosition?: LatLong | null;
  readonly radialLines?: RadialLines;
}): FeatureCollection => ({
  type: "FeatureCollection",
  features: [
    ...(viewerPosition ? [viewerPoint(viewerPosition)] : []),
    ...worldItems.flatMap((worldItem) =>
      pointAndVee(worldItem, viewerPosition, radialLines)
    ),
  ],
});

const viewerPoint = (viewerPosition: LatLong): GeoJSON.Feature => ({
  type: "Feature",
  properties: { label: "Viewer" },
  geometry: {
    type: "Point",
    coordinates: latlongToGeoJsonPosition(viewerPosition),
  },
});

const pointAndVee = (
  worldItem: WorldItem,
  viewerPosition: LatLong | null | undefined,
  radialLines?: RadialLines
): GeoJSON.Feature[] => {
  const features = [worldItem.geoJsonFeature];

  if (viewerPosition) {
    const bearings = addBearingsToWorldItem(worldItem, viewerPosition).bearings;

    features.push(
      ...(radialLines === "to-edges"
        ? [
            shortVee(
              viewerPosition,
              [bearings.minWithPoint.latlong, bearings.maxWithPoint.latlong],
              `to: ${worldItem.label}`
            ),
          ]
        : radialLines === "beyond-edges"
        ? longVee(viewerPosition, [bearings.min, bearings.max])
        : [])
    );
  }

  return features;
};

const shortVee = (
  origin: LatLong,
  edgePoints: [LatLong, LatLong],
  label: string
): GeoJSON.Feature => ({
  type: "Feature",
  properties: { label },
  geometry: {
    type: "LineString",
    coordinates: [
      latlongToGeoJsonPosition(edgePoints[0]),
      latlongToGeoJsonPosition(origin),
      latlongToGeoJsonPosition(edgePoints[1]),
    ],
  },
});
