"use client";

import { DEFAULT_THEME, ThemeProvider } from "@zendeskgarden/react-theming";
import { useState } from "react";
import { Tabs } from "@zendeskgarden/react-tabs";
import { Grid } from "@zendeskgarden/react-grid";
import SelectImageTab from "./SelectImageTab";
import SetCameraPositionTab from "./SetCameraPositionTab";
import type { ImageItem } from "./imageItem";
import type { WorldItem } from "./worldItem";
import { buildRegression, polynomial, type PairedItem } from "./bearing";
import ImageItemsTable from "./imageItemsTable";
import WorldItemsTable from "./worldItemsTable";
import ImageWithPins from "./imageWithPins/index";
import { LeafletProvider } from "./useLeaflet";
import { ReactLeafletProvider } from "./useReactLeaflet";

export default function Home() {
  const [imageSource, setImageSource] = useState<string>();

  const [cameraPosition, setCameraPosition] = useState<
    readonly [number, number] | undefined
  >(
    "cameraPosition" in localStorage
      ? JSON.parse(localStorage.cameraPosition) ?? undefined
      : undefined
  );

  const [imageItems, setImageItems] = useState<ImageItem[]>(() =>
    "imageItems" in localStorage ? JSON.parse(localStorage.imageItems) : []
  );
  const [worldItems, setWorldItems] = useState<WorldItem[]>(() =>
    "worldItems" in localStorage ? JSON.parse(localStorage.worldItems) : []
  );

  localStorage.cameraPosition = JSON.stringify(cameraPosition ?? null);
  localStorage.imageItems = JSON.stringify(imageItems);
  localStorage.worldItems = JSON.stringify(worldItems);

  const pairedItems = imageItems
    .map((imageItem) => ({
      imageItem,
      worldItem: worldItems.find((wi) => wi.id === imageItem.linkedWorldItemId),
    }))
    .filter((pair): pair is PairedItem => !!pair.worldItem);

  const pairOfRegressions = buildRegression(
    cameraPosition
      ? { degreesNorth: cameraPosition[0], degreesEast: cameraPosition[1] }
      : null,
    pairedItems,
    polynomial,
    { precision: 10, order: 2 }
  );

  const [activeTab, setActiveTab] = useState("selectImage");

  return (
    <ThemeProvider theme={DEFAULT_THEME}>
      <LeafletProvider>
        <ReactLeafletProvider>
          <div className="p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
            <main className="gap-8 items-center sm:items-start">
              <div className="App">
                <header className="App-header">
                  <Grid>
                    {imageSource && (
                      <Grid.Row justifyContent="center">
                        <ImageWithPins
                          imageItems={imageItems}
                          setImageItems={setImageItems}
                          imageSource={imageSource}
                          worldItems={worldItems}
                          pairOfRegressions={pairOfRegressions}
                          viewerPosition={
                            cameraPosition
                              ? {
                                  degreesNorth: cameraPosition[0],
                                  degreesEast: cameraPosition[1],
                                }
                              : null
                          }
                        />
                      </Grid.Row>
                    )}
                    <Grid.Row
                      style={{ marginTop: "1em" }}
                      justifyContent="center"
                    >
                      <Tabs
                        selectedItem={activeTab}
                        onChange={(e) => setActiveTab(e)}
                      >
                        <Tabs.TabList>
                          <Tabs.Tab item="selectImage">Select image</Tabs.Tab>
                          <Tabs.Tab item="cameraPosition">
                            Camera position
                          </Tabs.Tab>
                          <Tabs.Tab item="imageItems">Image items</Tabs.Tab>
                          <Tabs.Tab item="worldItems">World items</Tabs.Tab>
                        </Tabs.TabList>

                        <Tabs.TabPanel item="selectImage">
                          <SelectImageTab
                            imageSource={imageSource}
                            setImageSource={(img) => {
                              setImageSource(img);
                              // setActiveTab("cameraPosition");
                            }}
                          />
                        </Tabs.TabPanel>

                        <Tabs.TabPanel item="cameraPosition">
                          {activeTab === "cameraPosition" && (
                            <SetCameraPositionTab
                              cameraPosition={cameraPosition}
                              setCameraPosition={setCameraPosition}
                            />
                          )}
                        </Tabs.TabPanel>

                        <Tabs.TabPanel item="imageItems">
                          {activeTab === "imageItems" && (
                            <ImageItemsTable
                              imageItems={imageItems}
                              setImageItems={setImageItems}
                              worldItems={worldItems}
                              viewerPosition={
                                cameraPosition
                                  ? {
                                      degreesNorth: cameraPosition[0],
                                      degreesEast: cameraPosition[1],
                                    }
                                  : null
                              }
                              pairOfRegressions={pairOfRegressions}
                            />
                          )}
                        </Tabs.TabPanel>
                        <Tabs.TabPanel item="worldItems">
                          {activeTab === "worldItems" && (
                            <WorldItemsTable
                              worldItems={worldItems}
                              setWorldItems={setWorldItems}
                              viewerPosition={
                                cameraPosition
                                  ? {
                                      degreesNorth: cameraPosition[0],
                                      degreesEast: cameraPosition[1],
                                    }
                                  : null
                              }
                            />
                          )}
                        </Tabs.TabPanel>
                      </Tabs>
                    </Grid.Row>
                  </Grid>
                </header>
              </div>
            </main>
          </div>
        </ReactLeafletProvider>
      </LeafletProvider>
    </ThemeProvider>
  );
}
