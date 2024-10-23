export type LatLong = {
  readonly degreesNorth: number;
  readonly degreesEast: number;
};

export function parseOne(spec: string): number | null {
  return parseFloat(spec);
}

export function parse(spec: string): LatLong | null {
  const bits = spec.split(/\s*,\s*/);
  if (bits.length !== 2) return null;

  const out = bits.map(parseOne);
  if (out.includes(null)) return null;

  return {
    degreesNorth: out[0] as number,
    degreesEast: out[1] as number,
  };
}

export function parseRectangle(spec: string): [LatLong, LatLong] | null {
  const bits = spec.split(/\s*,\s*/);
  if (bits.length !== 4) return null;

  const out = bits.map(parseOne);
  if (out.includes(null)) return null;

  const nonNullOuts = out as number[];

  const norths = [nonNullOuts[0], nonNullOuts[2]].toSorted((a, b) => a - b);
  const easts = [nonNullOuts[1], nonNullOuts[3]].toSorted((a, b) => a - b);

  return [
    { degreesNorth: norths[0], degreesEast: easts[0] },
    { degreesNorth: norths[1], degreesEast: easts[1] },
  ];
}

// const qFloat = (name: string) => `(?<${name}Sign>[+-]?)(?<${name}Value>\\d+\\.\\d+)`;
// const qDMS = (name: string) => `(?<${name}Sign>[+-]?)(?<${name}Value>\\d+\\.\\d+)`;

// const reFloat = new RegExp(`^\s*${qFloat('t')}\s*$`);
// const reDMS = new RegExp(`^\s*${}`)

// const decimalPattern = /^(?<north>[+-]?\d+\.\d+),(?<east>[+-]?\d+\.\d+)$/;
// const dmsPattern =
//   /^(?<sgnN>[+-]?)(?<dN>\d+)\D(?<mN>\d+)\D(?<sN>\d+(?:\.\d+)?),(?<sgnE>[+-]?)(?<dE>\d+)\D(?<mE>\d+)\D(?<sE>\d+(?:\.\d+)?)$/;

// export const parse = (spec: string): LatLong | null => {
//   let match = decimalPattern.exec(spec);
//   if (match?.groups) {
//     return {
//       degreesNorth: parseFloat(match.groups.north),
//       degreesEast: parseFloat(match.groups.east),
//     };
//   }

//   match = dmsPattern.exec(spec);
//   if (match?.groups) {
//     return {
//       degreesNorth: dmsToFloat(
//         match.groups.sgnN,
//         match.groups.dN,
//         match.groups.mN,
//         match.groups.sN
//       ),
//       degreesEast: dmsToFloat(
//         match.groups.sgnE,
//         match.groups.dE,
//         match.groups.mE,
//         match.groups.sE
//       ),
//     };
//   }

//   return null;
// };

// const dmsToFloat = (
//   sign: string,
//   degrees: string,
//   minutes: string,
//   seconds: string
// ): number => {
//   const n =
//     parseInt(degrees) + parseInt(minutes) / 60 + parseFloat(seconds) / 3600;
//   if (sign === "-") return -n;
//   return n;
// };

// export function parseRectangle(spec: string): [LatLong, LatLong] | null {
//   return null;
// }

export const LatLong = {
  parseOne,
  parse,
  parseRectangle,
};
