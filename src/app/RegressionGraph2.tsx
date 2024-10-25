import type { ReactNode } from "react";
import { polynomial } from "regression";
import type { PairOfRegressions } from "./bearing";

function* steppedRange(
  start: number,
  end: number,
  step: number
): Generator<number> {
  let n = start;
  while (n <= end) {
    yield n;
    n += step;
  }
}

function RegressionGraph2({
  pairOfRegressions,
}: {
  pairOfRegressions: PairOfRegressions;
}) {
  const projectedMinBearing =
    pairOfRegressions.imagePercentXToBearing.result.predict(0)[1];
  const projectedMaxBearing =
    pairOfRegressions.imagePercentXToBearing.result.predict(100)[1];

  const newDataSet = pairOfRegressions.imagePercentXToBearing.inputData.map(
    ([imagePercentX, knownRealBearing]) => {
      const imageX55 = imagePercentX / 100 - 0.5;
      const bearing55 =
        (knownRealBearing - projectedMinBearing) /
          (projectedMaxBearing - projectedMinBearing) -
        0.5;
      return [bearing55, imageX55 - bearing55] as [number, number];
    }
  );

  const result = polynomial(newDataSet, { order: 2, precision: 6 });

  const xMarks: ReactNode[] = [];
  for (let step = -10; step <= +10; step = Math.round(step + 1)) {
    xMarks.push(
      <line
        key={`xMark-${step}`}
        x1={(step / 10) * 100}
        x2={step * 10}
        y1={0}
        y2={step % 2 === 0 ? 5 : 3}
        strokeWidth={"0.2"}
        stroke="black"
      />
    );
  }

  const assumedMaxSkew = 5 / 100;

  return (
    <>
      <svg
        style={{ width: "70vh", height: "70vh", border: "1px solid red" }}
        viewBox="-110 -110 220 220"
      >
        <g>
          <line
            id="y-axis"
            x1={0}
            y1={-100}
            x2={0}
            y2={+100}
            strokeWidth={"0.2"}
            stroke="black"
          />

          <line
            id="x-axis"
            x1={-100}
            y1={0}
            x2={+100}
            y2={0}
            strokeWidth={"0.2"}
            stroke="black"
          />

          <text
            x={-100}
            y={-30}
            style={{ fontSize: "4pt", writingMode: "sideways-lr" }}
          >
            left edge of field of view
          </text>

          <text
            x={100}
            y={-30}
            style={{ fontSize: "4pt", writingMode: "sideways-rl" }}
          >
            right edge of field of view
          </text>

          <g id="yNotches">
            {[...steppedRange(-assumedMaxSkew, +assumedMaxSkew, 1 / 100)].map(
              (yNotch) => {
                console.log({ yNotch });
                return (
                  <>
                    <line
                      x1={0}
                      y1={(yNotch / assumedMaxSkew) * 100}
                      y2={(yNotch / assumedMaxSkew) * 100}
                      x2={-3}
                      strokeWidth={"0.2"}
                      stroke="black"
                    />
                  </>
                );
              }
            )}
          </g>

          <g id="newDataSet">
            {newDataSet.map(([bearing, skew], index) => (
              <circle
                key={index}
                cx={bearing * 2 * 100}
                cy={(skew / assumedMaxSkew) * 100}
                r={1}
                fill="black"
              />
            ))}
          </g>

          <g id="xMarks">{...xMarks}</g>

          <path
            d={(() => {
              const bits: string[] = [];
              for (let bearing = -0.5; bearing <= 0.5; bearing += 0.01) {
                const [x, y] = result.predict(bearing);
                const op = bits.length === 0 ? "M" : "L";
                bits.push(`${op}${x * 2 * 100},${(y / assumedMaxSkew) * 100}`);
              }
              return bits.join(" ");
            })()}
            strokeWidth={"0.5"}
            stroke="lime"
            fill="none"
          />
        </g>
      </svg>
    </>
  );
}

export default RegressionGraph2;
