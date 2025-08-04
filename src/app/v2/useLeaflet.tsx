import * as React from "react";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type T = typeof import("leaflet");

const context = createContext<T>(null as unknown as T);

const useLeaflet = (): T => useContext(context);
export default useLeaflet;

export const LeafletProvider = ({ children }: PropsWithChildren) => {
  const [v, setV] = useState<T>();

  useEffect(() => {
    if (!v) import("leaflet").then(setV);
  }, [v]);

  if (!v) return;

  return <context.Provider value={v}>{children}</context.Provider>;
};
