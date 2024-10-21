export type LatLong = {
  readonly degreesNorth: number;
  readonly degreesEast: number;
};

export type ParsedLatLong = {
  readonly spec: string;
  readonly latlong: LatLong | null;
};

const decimalPattern = /^(?<north>[+-]?\d+\.\d+),(?<east>[+-]?\d+\.\d+)$/;
const dmsPattern =
  /^(?<sgnN>[+-]?)(?<dN>\d+)\D(?<mN>\d+)\D(?<sN>\d+(?:\.\d+)?),(?<sgnE>[+-]?)(?<dE>\d+)\D(?<mE>\d+)\D(?<sE>\d+(?:\.\d+)?)$/;

export const parse = (spec: string): ParsedLatLong => {
  let match = decimalPattern.exec(spec);
  if (match?.groups) {
    return {
      spec,
      latlong: {
        degreesNorth: parseFloat(match.groups.north),
        degreesEast: parseFloat(match.groups.east),
      },
    };
  }

  match = dmsPattern.exec(spec);
  if (match?.groups) {
    return {
      spec,
      latlong: {
        degreesNorth: dmsToFloat(
          match.groups.sgnN,
          match.groups.dN,
          match.groups.mN,
          match.groups.sN
        ),
        degreesEast: dmsToFloat(
          match.groups.sgnE,
          match.groups.dE,
          match.groups.mE,
          match.groups.sE
        ),
      },
    };
  }

  return { spec, latlong: null };
};

const dmsToFloat = (
  sign: string,
  degrees: string,
  minutes: string,
  seconds: string
): number => {
  const n =
    parseInt(degrees) + parseInt(minutes) / 60 + parseFloat(seconds) / 3600;
  if (sign === "-") return -n;
  return n;
};

export const LatLong = {
  parse,
};
