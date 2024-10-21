"use client";
import { Button } from "@zendeskgarden/react-buttons";
import { Grid } from "@zendeskgarden/react-grid";
import { Well } from "@zendeskgarden/react-notifications";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";

const debugEvents: readonly (keyof HTMLElementEventMap)[] = [
  "dragover",
  "dragenter",
  "dragleave",
  "drop",
  "paste",
];

function WithoutImage({
  setImageSource,
}: {
  setImageSource: (source: string) => void;
}) {
  const [dropTargetVisible, setDropTargetVisible] = useState(false);

  const handleTransfer = useMemo(
    () => (transfer: DataTransfer | null) => {
      if (transfer?.items) {
        for (let idx = 0; idx < transfer.items.length; ++idx) {
          const item = transfer.items[idx];
          if (item.kind !== "file") continue;

          const file = item.getAsFile();
          if (file) {
            setImageSource(URL.createObjectURL(file));
          }
        }
      }
    },
    [setImageSource]
  );

  const handleFileUpload = useMemo(
    () => (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length === 1) {
        setImageSource(URL.createObjectURL(e.target.files[0]));
      }
    },
    [setImageSource]
  );

  const dumpEvent = useMemo(
    () => (event: Event) => {
      if (["dragover", "drop"].includes(event.type)) event.preventDefault();

      if (event.type === "dragenter") setDropTargetVisible(true);
      if (event.type === "dragleave") setDropTargetVisible(false);

      if (event.type === "drop") {
        const drop = event as DragEvent;
        setDropTargetVisible(false);
        handleTransfer(drop.dataTransfer);
      }

      if (event.type === "paste") {
        const paste = event as ClipboardEvent;
        handleTransfer(paste.clipboardData);
      }
    },
    [handleTransfer, setDropTargetVisible]
  );

  useEffect(() => {
    debugEvents.forEach((eventName) =>
      document.body.addEventListener(eventName, dumpEvent)
    );
    return () => {
      debugEvents.forEach((eventName) =>
        document.body.removeEventListener(eventName, dumpEvent)
      );
    };
  }, [dumpEvent]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Well>
          <Grid>
            <Grid.Row>Choose an image file</Grid.Row>
            <Grid.Row>
              <input type="file" onChange={handleFileUpload} />
            </Grid.Row>
            <Grid.Row>or drag and drop an image file here</Grid.Row>
            <Grid.Row>or paste an image into this page</Grid.Row>
          </Grid>
        </Well>
      </main>
    </div>
  );
}

export default WithoutImage;
