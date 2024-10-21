import { Button, Anchor } from "@zendeskgarden/react-buttons";
import { Field, Input } from "@zendeskgarden/react-forms";
import { Grid } from "@zendeskgarden/react-grid";
import { LatLong } from "./LatLong";
import { type Dispatch, type SetStateAction } from "react";
import {
  addBearingToKnownImagePosition,
  type KnownWorldPositionPin,
  type Pin,
} from "./pin";
import { geoJsonUrl } from "./geoJson";
import regression from "regression";

function PinsTable({
  pins,
  setPins,
  viewerPosition,
  regressionResult,
}: {
  pins: Pin[];
  setPins: Dispatch<SetStateAction<Pin[]>>;
  viewerPosition: LatLong | null;
  regressionResult: regression.Result | null;
}) {
  return (
    <Grid>
      {pins
        .filter((p) => p.type === "known-world-position")
        .map((pin) => (
          <Grid.Row key={pin.id} style={{ marginBottom: "0.5em" }}>
            <Grid.Col>
              [{pin.inImage.percentX.toPrecision(8)}%,{" "}
              {pin.inImage.percentY.toPrecision(8)}%]
            </Grid.Col>
            <Grid.Col>
              <Field>
                <Input
                  value={pin.inWorldSpec}
                  onChange={(e) => {
                    const newPin: KnownWorldPositionPin = {
                      ...pin,
                      inWorldSpec: e.target.value,
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
              {pin.inWorld ? "" : pin.inWorldSpec !== "" && ":-("}

              {pin.inWorld && (
                <span style={{ whiteSpace: "preserve-spaces" }}>
                  <Anchor
                    href={`https://geohack.toolforge.org/geohack.php?pagename=Waila&params=${pin.inWorld.degreesNorth}_N_${pin.inWorld.degreesEast}_E_scale:2500_region:DK`}
                    isExternal={true}
                  >
                    Geohack
                  </Anchor>
                </span>
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

      {pins
        .filter((p) => p.type === "known-image-position")
        .map((pin) => (
          <Grid.Row key={pin.id} style={{ marginBottom: "0.5em" }}>
            <Grid.Col>
              [{pin.inImage.percentX.toPrecision(8)}%,{" "}
              {pin.inImage.percentY.toPrecision(8)}%]
            </Grid.Col>
            <Grid.Col>
              {regressionResult ? (
                <>
                  {addBearingToKnownImagePosition(
                    pin,
                    regressionResult
                  ).bearing.toPrecision(8)}
                  &deg;
                </>
              ) : (
                "?"
              )}
            </Grid.Col>
            <Grid.Col size={2}>
              {viewerPosition && regressionResult && (
                <Anchor
                  href={geoJsonUrl(
                    viewerPosition,
                    addBearingToKnownImagePosition(pin, regressionResult)
                      .bearing
                  )}
                  isExternal={true}
                  style={{ width: "fit-content", display: "inline-block" }}
                >
                  GeoJSON
                </Anchor>
              )}
            </Grid.Col>
            <Grid.Col size={4}>
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
