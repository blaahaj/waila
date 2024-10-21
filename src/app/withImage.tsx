"use client";
import { Anchor, Button } from "@zendeskgarden/react-buttons";
import { Field, Input } from "@zendeskgarden/react-forms";
import { Grid } from "@zendeskgarden/react-grid";
import { useState } from "react";
import { LatLong, type ParsedLatLong } from "./LatLong";
import { Well } from "@zendeskgarden/react-notifications";
import PinsTable from "./pinsTable";
import ImageWithPins from "./imageWithPins";
import ImportExport from "./importExport";

export type Pin = {
  readonly id: string;
  readonly label: string;
  readonly inImage: {
    readonly percentX: number;
    readonly percentY: number;
  };
  readonly inWorld: ParsedLatLong;
};

function WithImage({
  imageSource,
  clearImage,
}: {
  imageSource: string;
  clearImage: () => void;
}) {
  const [viewerPosition, setViewerPosition] = useState(LatLong.parse(""));
  const [pins, setPins] = useState<Pin[]>([]);

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
                  />
                </Grid.Col>
              </Grid.Row>
              <Grid.Row style={{ marginTop: "1em" }}>
                <Grid.Col md={4}>
                  <Field>
                    <Field.Label>Viewer position</Field.Label>
                    <Field.Hint>
                      The latitude/longitude from where the picture was taken
                    </Field.Hint>
                    <Input
                      value={viewerPosition.spec}
                      onChange={(e) =>
                        setViewerPosition(LatLong.parse(e.currentTarget.value))
                      }
                    />
                    {viewerPosition.spec === "" && (
                      <Field.Message validation="warning" validationLabel="...">
                        Enter a value
                      </Field.Message>
                    )}
                    {viewerPosition.spec !== "" && !viewerPosition.latlong && (
                      <Field.Message validation="error" validationLabel="...">
                        Invalid input
                      </Field.Message>
                    )}
                    {viewerPosition.latlong && (
                      <Field.Message validation="success" validationLabel="...">
                        See this position on{" "}
                        <Anchor
                          href={`https://geohack.toolforge.org/geohack.php?pagename=Waila&params=${viewerPosition.latlong.degreesNorth}_N_${viewerPosition.latlong.degreesEast}_E_scale:2500_region:DK`}
                          isExternal={true}
                        >
                          Geohack
                        </Anchor>
                      </Field.Message>
                    )}
                  </Field>
                </Grid.Col>
                <Grid.Col md={8}>
                  Pins:
                  <PinsTable pins={pins} setPins={setPins} />
                </Grid.Col>
              </Grid.Row>
              <Grid.Row style={{ marginTop: "1em" }}>
                <Grid.Col>
                  <Button onClick={clearImage}>Clear image</Button>
                </Grid.Col>
                <Grid.Col>Double-click in the image to add a point</Grid.Col>
                <Grid.Col>
                  <Anchor href="/asd/">View in GeoJSOOON</Anchor>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col>
                  <ImportExport
                    pins={pins}
                    setPins={setPins}
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
