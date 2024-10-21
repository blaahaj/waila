import { Button, Anchor } from "@zendeskgarden/react-buttons";
import { Field, Input } from "@zendeskgarden/react-forms";
import { Grid } from "@zendeskgarden/react-grid";
import { LatLong } from "./LatLong";
import type { Pin } from "./withImage";
import { useState, type Dispatch, type SetStateAction } from "react";

function PinsTable({
  pins,
  setPins,
}: {
  pins: Pin[];
  setPins: Dispatch<SetStateAction<Pin[]>>;
}) {
  return (
    <Grid>
      {pins.map((pin) => (
        <Grid.Row key={pin.id}>
          <Grid.Col>
            [{pin.inImage.percentX.toPrecision(5)}%,{" "}
            {pin.inImage.percentY.toPrecision(5)}%]
          </Grid.Col>
          <Grid.Col>
            <Field>
              <Input
                value={pin.inWorld.spec}
                onChange={(e) => {
                  const newPin: Pin = {
                    ...pin,
                    inWorld: LatLong.parse(e.target.value),
                  };
                  setPins(pins.map((p) => (p === pin ? newPin : p)));
                }}
                size={20}
                width={"10em"}
              />
            </Field>
          </Grid.Col>
          <Grid.Col>
            {pin.inWorld.latlong ? "" : pin.inWorld.spec !== "" && ":-("}

            {pin.inWorld.latlong && (
              <Field.Message validation="success" validationLabel="...">
                <Anchor
                  href={`https://geohack.toolforge.org/geohack.php?pagename=Waila&params=${pin.inWorld.latlong.degreesNorth}_N_${pin.inWorld.latlong.degreesEast}_E_scale:2500_region:DK`}
                  isExternal={true}
                >
                  Geohack
                </Anchor>
              </Field.Message>
            )}
          </Grid.Col>
          <Grid.Col>
            <Input
              value={pin.label}
              onChange={(event) =>
                setPins(
                  pins.map((p) =>
                    p === pin ? { ...pin, label: event.target.value } : p
                  )
                )
              }
              size={20}
              width={"10em"}
            />
          </Grid.Col>
          <Grid.Col>
            <Button onClick={() => setPins(pins.filter((p) => p !== pin))}>
              Remove
            </Button>
          </Grid.Col>
        </Grid.Row>
      ))}
    </Grid>
  );
}

export default PinsTable;
