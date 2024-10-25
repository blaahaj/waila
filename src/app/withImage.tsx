"use client";
import { Button } from "@zendeskgarden/react-buttons";
import { Grid } from "@zendeskgarden/react-grid";
import { useState } from "react";
import { LatLong } from "./LatLong";
import ImageWithPins from "./imageWithPins";
import ImportExport from "./importExport";
import type { ImageItem } from "./imageItem";
import type { WorldItem } from "./worldItem";
import { buildRegression, type PairedItem } from "./bearing";
import ImageItemsTable from "./imageItemsTable";
import WorldItemsTable from "./worldItemsTable";
import ViewerPosition from "./viewerPosition";
import { Tabs } from "@zendeskgarden/react-tabs";
import { polynomial } from "regression";
import RegressionGraph from "./RegressionGraph";

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

  const pairOfRegressions = buildRegression(
    viewerPosition,
    pairedItems,
    polynomial,
    { precision: 10, order: 2 }
  );

  const [activeTab, setActiveTab] = useState("viewerPosition");

  return (
    <div className="p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="gap-8 items-center sm:items-start">
        <div className="App">
          <header className="App-header">
            <Grid>
              <Grid.Row justifyContent="center">
                <ImageWithPins
                  imageItems={imageItems}
                  setImageItems={setImageItems}
                  imageSource={imageSource}
                  worldItems={worldItems}
                  pairOfRegressions={pairOfRegressions}
                  viewerPosition={viewerPosition}
                />
              </Grid.Row>
              <Grid.Row style={{ marginTop: "1em" }}>
                <Tabs
                  selectedItem={activeTab}
                  onChange={(e) => setActiveTab(e)}
                >
                  <Tabs.TabList>
                    <Tabs.Tab item="viewerPosition">Camera position</Tabs.Tab>
                    <Tabs.Tab item="imageItems">Image items</Tabs.Tab>
                    <Tabs.Tab item="worldItems">World items</Tabs.Tab>
                    <Tabs.Tab item="regression">Regression</Tabs.Tab>
                    {/* <Tabs.Tab item="regression 2">Regression 2</Tabs.Tab> */}
                    <Tabs.Tab item="importExport">Import / Export</Tabs.Tab>
                    <Tabs.Tab item="reset">Reset</Tabs.Tab>
                  </Tabs.TabList>
                  <Tabs.TabPanel item="viewerPosition">
                    {activeTab === "viewerPosition" && (
                      <ViewerPosition
                        viewerPosition={viewerPosition}
                        viewerPositionSpec={viewerPositionSpec}
                        setViewerPosition={setViewerPosition}
                        setViewerPositionSpec={setViewerPositionSpec}
                      />
                    )}
                  </Tabs.TabPanel>
                  <Tabs.TabPanel item="imageItems">
                    {activeTab === "imageItems" && (
                      <ImageItemsTable
                        imageItems={imageItems}
                        setImageItems={setImageItems}
                        worldItems={worldItems}
                        viewerPosition={viewerPosition}
                        pairOfRegressions={pairOfRegressions}
                      />
                    )}
                  </Tabs.TabPanel>
                  <Tabs.TabPanel item="worldItems">
                    {activeTab === "worldItems" && (
                      <WorldItemsTable
                        worldItems={worldItems}
                        setWorldItems={setWorldItems}
                        viewerPosition={viewerPosition}
                      />
                    )}
                  </Tabs.TabPanel>
                  <Tabs.TabPanel item="regression">
                    {activeTab === "regression" && (
                      <>
                        {pairOfRegressions ? (
                          <RegressionGraph
                            pairOfRegressions={pairOfRegressions}
                          />
                        ) : (
                          "Not enough data yet"
                        )}
                      </>
                    )}
                  </Tabs.TabPanel>
                  {/* <Tabs.TabPanel item="regression 2">
                    {activeTab === "regression 2" && (
                      <>
                        {pairOfRegressions ? (
                          <RegressionGraph2
                            pairOfRegressions={pairOfRegressions}
                          />
                        ) : (
                          "Not enough data yet"
                        )}
                      </>
                    )}
                  </Tabs.TabPanel> */}
                  <Tabs.TabPanel item="importExport">
                    {activeTab === "importExport" && (
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
                    )}
                  </Tabs.TabPanel>
                  <Tabs.TabPanel item="reset">
                    <Button onClick={clearImage} isDanger={true}>
                      Clear image
                    </Button>
                  </Tabs.TabPanel>
                </Tabs>
              </Grid.Row>
            </Grid>
          </header>
        </div>
      </main>
    </div>
  );
}

export default WithImage;
