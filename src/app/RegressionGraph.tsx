import type { Result } from "regression";

function RegressionGraph({
  regressionResult,
  dataPoints,
}: {
  regressionResult: Result;
  dataPoints: readonly [number, number][];
}) {
  const minY = regressionResult.points.reduce(
    (acc, item) => (item[1] < acc ? item[1] : acc),
    Infinity
  );

  const maxY = regressionResult.points.reduce(
    (acc, item) => (item[1] > acc ? item[1] : acc),
    -Infinity
  );

  const predictedBearingAtX0 = regressionResult.predict(0)[1];
  const predictedBearingAtX100 = regressionResult.predict(100)[1];

  const yNotches: number[] = [];
  for (
    let bearing = Math.floor(predictedBearingAtX0);
    bearing < predictedBearingAtX100;
    bearing += 1
  ) {
    yNotches.push(bearing);
  }

  const yPerDegree = 400 / (predictedBearingAtX100 - predictedBearingAtX0);

  return (
    <svg
      style={{ width: "70vh", height: "70vh", border: "1px solid red" }}
      viewBox="-20 -210 440 420"
    >
      <g>
        {/* <circle cx={100} cy={0} r={10} fill="red" />
        <circle cx={0} cy={0} r={7} fill="green" />
        <circle cx={0} cy={100} r={4} fill="blue" />

        <path
          d="M0,0 100,0 100,100 Z"
          strokeWidth={1}
          color="red"
          floodColor={"orange"}
        /> */}

        <line
          id="y-axis"
          x1={200}
          y1={-200}
          x2={200}
          y2={200}
          strokeWidth={"0.2"}
          stroke="black"
        />

        <line
          id="x-axis"
          x1={0}
          y1={0}
          x2={400}
          y2={0}
          strokeWidth={"0.2"}
          stroke="black"
        />

        <text
          x={0}
          y={10}
          style={{ fontSize: "8pt", writingMode: "sideways-lr" }}
        >
          0%
        </text>

        <text
          x={400}
          y={10}
          style={{ fontSize: "8pt", writingMode: "sideways-lr" }}
        >
          100%
        </text>

        <text x={210} y={-200} style={{ fontSize: "8pt" }}>
          {predictedBearingAtX100.toFixed(3)}&deg;
        </text>

        <text x={210} y={200} style={{ fontSize: "8pt" }}>
          {predictedBearingAtX0.toFixed(3)}&deg;
        </text>

        {yNotches.map((bearing) => (
          <line
            key={bearing}
            x1={200 - (bearing % 5 === 0 ? 10 : 3)}
            x2={200 + (bearing % 5 === 0 ? 10 : 3)}
            y1={200 - (bearing - predictedBearingAtX0) * yPerDegree}
            y2={200 - (bearing - predictedBearingAtX0) * yPerDegree}
            strokeWidth={"0.2"}
            stroke="black"
          />
        ))}

        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((pct) => (
          <line
            key={pct}
            x1={(400 * pct) / 100}
            x2={(400 * pct) / 100}
            y1={+3}
            y2={-3}
            strokeWidth={"0.2"}
            stroke="black"
          />
        ))}

        {dataPoints.map((point) => (
          <circle
            cx={point[0] * 4}
            cy={200 - (point[1] - predictedBearingAtX0) * yPerDegree}
            r={1}
            fill="black"
          />
        ))}
      </g>
    </svg>
  );
}

export default RegressionGraph;
