import * as React from "react";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type T = typeof import("react-leaflet");

const context = createContext<T>(null as unknown as T);

const useReactLeaflet = (): T => useContext(context);
export default useReactLeaflet;

export const ReactLeafletProvider = ({ children }: PropsWithChildren) => {
  const [v, setV] = useState<T>();

  useEffect(() => {
    if (!v) import("react-leaflet").then(setV);
  }, [v]);

  if (!v) return;

  return <context.Provider value={v}>{children}</context.Provider>;
};
