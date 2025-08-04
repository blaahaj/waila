import * as React from "react";

import { useMemo } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import * as RL from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import { Grid } from "@zendeskgarden/react-grid";
import { Button } from "@zendeskgarden/react-buttons";

export const centralCopenhagenIsh: readonly [number, number] = [
  55.68731239016637, 12.563096868347941,
];

export type MaybePos = readonly [number, number] | undefined;

const MapContents = ({
  cameraPosition,
  setCameraPosition,
}: {
  cameraPosition: MaybePos;
  setCameraPosition: React.Dispatch<React.SetStateAction<MaybePos>>;
}) => {
  const onDblClick = useMemo(
    () => (e: LeafletMouseEvent) => {
      setCameraPosition([e.latlng.lat, e.latlng.lng]);
    },
    [setCameraPosition]
  );

  RL.useMapEvents({
    dblclick: onDblClick,
  });

  return <>{cameraPosition && <RL.Marker position={[...cameraPosition]} />}</>;
};

export default function SetCameraPositionTab({
  cameraPosition,
  setCameraPosition,
}: {
  cameraPosition: MaybePos;
  setCameraPosition: React.Dispatch<React.SetStateAction<MaybePos>>;
}) {
  const mapPosition = cameraPosition ?? centralCopenhagenIsh;

  return (
    <Grid>
      <Grid.Row>
        <RL.MapContainer
          center={[...mapPosition]}
          zoom={12}
          style={{ width: "500px", height: "500px" }}
        >
          <RL.TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            minZoom={3}
            maxZoom={19}
          ></RL.TileLayer>
          <RL.ScaleControl />
          <MapContents
            cameraPosition={cameraPosition}
            setCameraPosition={setCameraPosition}
          />
        </RL.MapContainer>
      </Grid.Row>
      <Grid.Row style={{ padding: "1em" }}>
        <Button
          onClick={() => setCameraPosition(undefined)}
          isDanger={true}
          disabled={cameraPosition === undefined}
        >
          Unset camera position
        </Button>
      </Grid.Row>
    </Grid>
  );
}
