"use client";
import { Anchor, Button } from "@zendeskgarden/react-buttons";
import { Field, Input } from "@zendeskgarden/react-forms";
import { Grid } from "@zendeskgarden/react-grid";
import { useState } from "react";
import { LatLong } from "./LatLong";
import ImageWithPins from "./imageWithPins";
import ImportExport from "./importExport";
import type { ImageItem } from "./imageItem";
import type { WorldItem } from "./worldItem";
import {
  buildRegression,
  leastSquaresLinear,
  type PairedItem,
} from "./bearing";
import ImageItemsTable from "./imageItemsTable";
import { Accordion } from "@zendeskgarden/react-accordions";
import WorldItemsTable from "./worldItemsTable";

function WithImage({
  imageSource,
  clearImage,
}: {
  imageSource: string;
  clearImage: () => void;
}) {
  const [viewerPositionSpec, setViewerPositionSpec] = useState("");
  const [viewerPosition, setViewerPosition] = useState<LatLong | null>(null);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [worldItems, setWorldItems] = useState<WorldItem[]>([]);

  const pairedItems = imageItems
    .map((imageItem) => ({
      imageItem,
      worldItem: worldItems.find((wi) => wi.id === imageItem.linkedWorldItemId),
    }))
    .filter((pair): pair is PairedItem => !!pair.worldItem);

  const regressionResult = buildRegression(
    viewerPosition,
    pairedItems,
    leastSquaresLinear,
    { precision: 10 }
  );

  return (
    <div className="p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="gap-8 items-center sm:items-start">
        <div className="App">
          <header className="App-header">
            <Grid>
              <Grid.Row justifyContent="center">
                <Grid.Col>
                  <ImageWithPins
                    imageItems={imageItems}
                    setImageItems={setImageItems}
                    imageSource={imageSource}
                    // viewerPosition={viewerPosition}
                    // regressionResult={regressionResult}
                  />
                </Grid.Col>
              </Grid.Row>
              <Grid.Row style={{ marginTop: "1em" }}>
                <Grid.Col md={3}>
                  <Accordion level={4} style={{ width: "75vw" }}>
                    <Accordion.Section defaultValue={8}>
                      <Accordion.Header>
                        <Accordion.Label>Camera position</Accordion.Label>
                      </Accordion.Header>
                      <Accordion.Panel>
                        <Field>
                          <Field.Label>Viewer position</Field.Label>
                          <Field.Hint>
                            The latitude/longitude from where the picture was
                            taken
                          </Field.Hint>
                          <Input
                            value={viewerPositionSpec}
                            onChange={(e) => {
                              setViewerPositionSpec(e.currentTarget.value);
                              setViewerPosition(
                                LatLong.parse(e.currentTarget.value)
                              );
                            }}
                          />
                          {viewerPositionSpec === "" && (
                            <Field.Message
                              validation="warning"
                              validationLabel="..."
                            >
                              Enter a value
                            </Field.Message>
                          )}
                          {viewerPositionSpec !== "" && !viewerPosition && (
                            <Field.Message
                              validation="error"
                              validationLabel="..."
                            >
                              Invalid input
                            </Field.Message>
                          )}
                          {viewerPosition && (
                            <Field.Message
                              validation="success"
                              validationLabel="..."
                            >
                              See this position on{" "}
                              <Anchor
                                href={`https://geohack.toolforge.org/geohack.php?pagename=Waila&params=${viewerPosition.degreesNorth}_N_${viewerPosition.degreesEast}_E_scale:2500_region:DK`}
                                isExternal={false}
                              >
                                Geohack
                              </Anchor>
                            </Field.Message>
                          )}
                        </Field>
                      </Accordion.Panel>
                    </Accordion.Section>
                    <Accordion.Section defaultValue={9}>
                      <Accordion.Header>
                        <Accordion.Label>Image items</Accordion.Label>
                      </Accordion.Header>
                      <Accordion.Panel>
                        <ImageItemsTable
                          imageItems={imageItems}
                          setImageItems={setImageItems}
                          worldItems={worldItems}
                          viewerPosition={viewerPosition}
                          regressionResult={regressionResult}
                        />
                      </Accordion.Panel>
                    </Accordion.Section>
                    <Accordion.Section>
                      <Accordion.Header>
                        <Accordion.Label>World items</Accordion.Label>
                      </Accordion.Header>
                      <Accordion.Panel>
                        <WorldItemsTable
                          worldItems={worldItems}
                          setWorldItems={setWorldItems}
                          viewerPosition={viewerPosition}
                          regressionResult={regressionResult}
                        />
                      </Accordion.Panel>
                    </Accordion.Section>
                    <Accordion.Section>
                      <Accordion.Header>
                        <Accordion.Label>Import / Export</Accordion.Label>
                      </Accordion.Header>
                      <Accordion.Panel>
                        <ImportExport
                          imageItems={imageItems}
                          setImageItems={setImageItems}
                          worldItems={worldItems}
                          setWorldItems={setWorldItems}
                          viewerPositionSpec={viewerPositionSpec}
                          setViewerPositionSpec={setViewerPositionSpec}
                          viewerPosition={viewerPosition}
                          setViewerPosition={setViewerPosition}
                        />
                      </Accordion.Panel>
                    </Accordion.Section>
                  </Accordion>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row style={{ marginTop: "1em" }}>
                <Grid.Col>
                  <Button onClick={clearImage} isDanger={true}>
                    Clear image
                  </Button>
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
