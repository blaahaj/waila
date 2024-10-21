"use client";
import { Anchor, Button } from "@zendeskgarden/react-buttons";
import { Field, Input } from "@zendeskgarden/react-forms";
import { Grid } from "@zendeskgarden/react-grid";
import { useState, type MouseEventHandler } from "react";
import { LatLong } from "./LatLong";
import PinsTable from "./pinsTable";
import ImageWithPins from "./imageWithPins";
import ImportExport from "./importExport";
import {
  addBearingToKnownWorldPosition,
  isValidKnownPosition,
  type KnownImagePositionPin,
  type Pin,
} from "./pin";
import regression from "regression";

function naiveLinear(dataPoints: regression.DataPoint[]): regression.Result {
  const sorted = dataPoints.sort((a, b) => a[0] - b[0]);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const imageXDelta = max[0] - min[0];
  const bearingDelta = max[1] - min[1];

  return {
    predict: (x: number) => [
      x,
      ((x - min[0]) / imageXDelta) * bearingDelta + min[1],
    ],
  } as regression.Result;
}

function WithImage({
  imageSource,
  clearImage,
}: {
  imageSource: string;
  clearImage: () => void;
}) {
  const [viewerPositionSpec, setViewerPositionSpec] = useState("");
  const [viewerPosition, setViewerPosition] = useState<LatLong | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);

  const dataPoints: regression.DataPoint[] = viewerPosition
    ? pins
        .filter(isValidKnownPosition)
        .map((pin) => [
          pin.inImage.percentX,
          addBearingToKnownWorldPosition(pin, viewerPosition).bearing,
        ])
    : [];

  console.log({ dataPoints });

  const regressionResult =
    dataPoints.length >= 2
      ? // ? regression.linear(dataPoints, { precision: 8 })
        naiveLinear(dataPoints)
      : null;

  console.log({ regressionResult });

  if (regressionResult) {
    console.log({
      accuracy: pins
        .filter(isValidKnownPosition)
        .map((pin) => [
          pin.label,
          [
            pin.inImage.percentX,
            addBearingToKnownWorldPosition(pin, viewerPosition!).bearing,
          ],
          regressionResult.predict(pin.inImage.percentX),
        ]),
    });
  }

  return (
    <div className="p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="gap-8 items-center sm:items-start">
        <div className="App">
          <header className="App-header">
            <Grid>
              <Grid.Row justifyContent="center">
                <Grid.Col>
                  <ImageWithPins
                    pins={pins}
                    setPins={setPins}
                    imageSource={imageSource}
                    viewerPosition={viewerPosition}
                    regressionResult={regressionResult}
                  />
                </Grid.Col>
              </Grid.Row>
              <Grid.Row style={{ marginTop: "1em" }}>
                <Grid.Col md={3}>
                  <Field>
                    <Field.Label>Viewer position</Field.Label>
                    <Field.Hint>
                      The latitude/longitude from where the picture was taken
                    </Field.Hint>
                    <Input
                      value={viewerPositionSpec}
                      onChange={(e) => {
                        setViewerPositionSpec(e.currentTarget.value);
                        setViewerPosition(LatLong.parse(e.currentTarget.value));
                      }}
                    />
                    {viewerPositionSpec === "" && (
                      <Field.Message validation="warning" validationLabel="...">
                        Enter a value
                      </Field.Message>
                    )}
                    {viewerPositionSpec !== "" && !viewerPosition && (
                      <Field.Message validation="error" validationLabel="...">
                        Invalid input
                      </Field.Message>
                    )}
                    {viewerPosition && (
                      <Field.Message validation="success" validationLabel="...">
                        See this position on{" "}
                        <Anchor
                          href={`https://geohack.toolforge.org/geohack.php?pagename=Waila&params=${viewerPosition.degreesNorth}_N_${viewerPosition.degreesEast}_E_scale:2500_region:DK`}
                          isExternal={true}
                        >
                          Geohack
                        </Anchor>
                      </Field.Message>
                    )}
                  </Field>
                </Grid.Col>
                <Grid.Col md={9}>
                  <PinsTable
                    pins={pins}
                    setPins={setPins}
                    viewerPosition={viewerPosition}
                    regressionResult={regressionResult}
                  />
                </Grid.Col>
              </Grid.Row>
              <Grid.Row style={{ marginTop: "1em" }}>
                <Grid.Col>
                  <Button onClick={clearImage}>Clear image</Button>
                </Grid.Col>
                <Grid.Col>
                  Double-click in the image to add a point with a known latitude
                  / longitude. Shift-double-click in the image to draw a bearing
                  to an unknown object.
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col>
                  <ImportExport
                    pins={pins}
                    setPins={setPins}
                    viewerPositionSpec={viewerPositionSpec}
                    setViewerPositionSpec={setViewerPositionSpec}
                    viewerPosition={viewerPosition}
                    setViewerPosition={setViewerPosition}
                  />
                </Grid.Col>
              </Grid.Row>
            </Grid>
          </header>
        </div>
      </main>
    </div>
  );
}

export default WithImage;
