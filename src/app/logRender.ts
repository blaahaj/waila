import type { FunctionComponent } from "react";

let id = 0;

export const logRender = <P>(
  fn: FunctionComponent<P>
): FunctionComponent<P> => {
  const newFunc = function (...args: Parameters<FunctionComponent<P>>) {
    ++id;
    const t0 = new Date().getTime();

    try {
      const r = fn(...args);
      const t1 = new Date().getTime();
      console.log(
        `rendered ${fn.displayName ?? fn.name} in ${t1 - t0}ns #${id}`
      );
      return r;
    } catch (error) {
      const t1 = new Date().getTime();
      console.log(
        `rendered ${fn.displayName ?? fn.name} in ${t1 - t0}ns [crashed] #${id}`
      );
      throw error;
    }
  };

  //   newFunc.name = fn.name;
  newFunc.displayName = fn.displayName;

  return newFunc as FunctionComponent<P>;
};
