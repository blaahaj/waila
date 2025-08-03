"use client";

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

export default function FileUploader({
  setImageSource,
  reloadList,
}: {
  setImageSource: React.Dispatch<React.SetStateAction<string | undefined>>;
  reloadList: () => void;
}) {
  const [dropTargetVisible, setDropTargetVisible] = useState(false);

  const onImageFile = useMemo(
    () => async (f: File) => {
      const dir = await navigator.storage.getDirectory();
      const localFile = await dir.getFileHandle(f.name, {
        create: true,
      });
      const w = await localFile.createWritable();
      await w.write(await f.arrayBuffer());
      await w.close();
      reloadList();

      setImageSource(URL.createObjectURL(f));
    },
    [setImageSource, reloadList]
  );

  const handleTransfer = useMemo(
    () => (transfer: DataTransfer | null) => {
      if (transfer?.items) {
        for (let idx = 0; idx < transfer.items.length; ++idx) {
          const item = transfer.items[idx];
          if (item.kind !== "file") continue;

          const file = item.getAsFile();
          if (file) {
            onImageFile(file);
          }
        }
      }
    },
    [onImageFile]
  );

  const handleFileUpload = useMemo(
    () => (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length === 1) {
        onImageFile(e.target.files[0]);
      }
    },
    [onImageFile]
  );

  const dumpEvent = useMemo(
    () => (event: Event) => {
      if (event.type !== "dragover") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.debug(`${event.type} ${(event.target as any).nodeName}`, {
          event,
        });
      }

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
    <div>
      <main>
        <Well
          style={{
            border: dropTargetVisible ? "0.2em dashed #555" : undefined,
          }}
        >
          <Grid>
            <Grid.Row>
              <input type="file" onChange={handleFileUpload} />
            </Grid.Row>
          </Grid>
        </Well>
      </main>
    </div>
  );
}
