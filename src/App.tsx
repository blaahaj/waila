import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import './App.css';

const debugEvents: readonly (keyof HTMLElementEventMap)[] = [
  "dragover",
  "dragenter",
  "dragleave",
  "drop",
  "paste",
];

// const logEvent = (() => {
//   let lastEvent: Event | null = null;

//   return (event: Event) => {
//     if (lastEvent && event.type === lastEvent.type && event.target === lastEvent.target) return;

//     console.log(event);
//     lastEvent = event;
//   };
// })();

function App() {
  const [imageSource, setImageSource] = useState<string>();
  const [dropTargetVisible, setDropTargetVisible] = useState(false);

  const handleTransfer = useMemo(() => (transfer: DataTransfer | null) => {
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
  }, [setImageSource]);

  const handleFileUpload = useMemo(() =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length === 1) {
        setImageSource(URL.createObjectURL(e.target.files[0]));
      }
    } , [setImageSource])

  const dumpEvent = useMemo(() =>
    (event: Event) => {
      // logEvent(event);

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
    [handleTransfer, setDropTargetVisible],
  );

  useEffect(
    () => {
      debugEvents.forEach(eventName => document.body.addEventListener(eventName, dumpEvent));
      return () => {
        debugEvents.forEach(eventName => document.body.removeEventListener(eventName, dumpEvent));
      };
    },
    [dumpEvent],
  );

  return (
    <div className="App" style={{margin: "1em", border: `0.5em solid ${dropTargetVisible ? "red" : "transparent"}`}}>
      <header className="App-header">
        {imageSource && (<>
          <img src={imageSource} className="App-logo" alt="logo" />
          <button onClick={() => setImageSource(undefined)}>Clear image</button>
        </>)}

        {!imageSource && <>
          <p>Drop, paste, or upload an image to begin</p>
          <input type="file" onChange={handleFileUpload}/>
          </>
        }
      </header>
    </div>
  );
}

export default App;
