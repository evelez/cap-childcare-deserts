import * as csv from 'csv-parse';
import * as commander from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import { format } from 'prettier';
import * as glob from 'glob';
import * as shapefile from 'shapefile';
import { exec, ExecOptions } from 'child_process';

if (require.main === module) run().catch(console.error);

interface StateDataResult {
  State: string;
  'Percent in deserts - All': number;
  'Percent in deserts - Black': number;
  'Percent in deserts - White': number;
  'Percent in deserts - Hispanic': number;
  'Chidren under 5 in deserts- rural': number;
  'Children under 5 not in deserts- rural': number;
  'Children under 5 in deserts- suburban': number;
  'Children under 5 not in deserts- suburban': number;
  'Children under 5  in deserts- urban': number;
  'Children under 5 not in deserts- urban': number;
  'Text box': string;
}

function camelcase(p: string) {
  return p
    .split(/[^\w\d]+/i)
    .map(
      (s, i) =>
        i > 0
          ? s.charAt(0).toUpperCase() + s.slice(1, s.length).toLowerCase()
          : s.toLowerCase()
    )
    .join('');
}

async function run() {
  const program = commander
    .option('-s, --state-data <csvfile>', 'parse state data file')
    .option('-t, --tiles <glob>', 'generate mapbox tiles')
    .parse(process.argv);

  switch (true) {
    case !!program.stateData:
      await prepStateData(program.stateData);
      break;

    case !!program.tiles:
      await prepShapefiles(program.tiles);
      break;

    default: {
      program.outputHelp();
    }
  }

  process.exit(0);
}

type TractDataResult = {
  state: string;
  tract: number;
  ccdesert: number;
  per_latino: number;
  per_white: number;
  per_black: number;
  per_aian: number;
  per_asian: number;
  per_nhpi: number;
  per_twomore: number;
  urbanicity: string;
  noproviders: number;
  state_fips: number;
};

function mkdirp(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

async function prepShapefiles(globString: string) {
  const files = glob.sync(globString);
  const tmp = path.join(__dirname, '../data/tmp');
  const json = path.join(__dirname, '../data/json');

  mkdirp(tmp);
  mkdirp(json);

  const data = await readCsv<TractDataResult>('./data/tract_data.csv');
  const tractHash = data.reduce((out, d) => {
    out[d.tract.toString()] = d;
    return out;
  }, {} as { [key: string]: TractDataResult });

  await Promise.all(
    files.map(async file => {
      const bits = file.split('/');
      const name = bits[bits.length - 1].replace('.shp', '');

      const result = await shapefile.read(file);
      result.features.forEach((f: any) => {
        const tract = Number(f.properties['GEOID']);
        const tractData = tractHash[tract];
        if (tractData) {
          Object.keys(tractData).forEach((k: keyof TractDataResult) => {
            if (k !== 'tract') {
              f.properties[k] = tractData[k];
            }
          });
        } else {
          console.log(`No data for ${tract}...`);
        }
      });

      await fs.writeFile(
        path.join(json, `${name}.json`),
        JSON.stringify(result)
      );

      console.log(`Converted ${name}...`);
    })
  );

  await prun(`tippecanoe -o ./data/tracts.mbtiles -Z 2 -zg ./data/json/*.json`);

  console.log(`finished!`);
}

async function readCsv<T>(filename: string) {
  const file = await fs.readFile(path.join(process.cwd(), filename));
  const result = await new Promise<T[]>((res, rej) =>
    csv(
      file.toString(),
      { auto_parse: true, columns: true },
      (err: Error, d: any) => (err ? rej(err) : res(d))
    )
  );
  return result;
}

async function prepStateData(filename: string) {
  const result = await readCsv<StateDataResult>(filename);
  const states = result.map(r => r.State);
  const reduced = result.reduce((out, r: any) => {
    out[r.State] = Object.keys(r).reduce((d, k) => {
      d[camelcase(k)] = r[k];
      return d;
    }, {} as any);
    return out;
  }, {} as any);

  const code = format(
    `
/**
 *
 * don't edit this file, it's generated by ./dev/data.ts using the state csv file
 *
 */
/**
 * name of state with data
 */
      export type StateName = ${states.map(s => JSON.stringify(s)).join('|')};

      export const stateList: StateName[] = ${JSON.stringify(states)};

      export const stateData = ${JSON.stringify(reduced)};
    `,
    { singleQuote: true }
  );

  console.log(`writing ./src/data/states.ts...`);
  fs.writeFileSync(path.join(__dirname, '../src/data/states.ts'), code);
}

// promise based exec
export default function prun(
  cmd: string,
  options: ExecOptions = {}
): Promise<{ err: Error; stdout: string; stderr: string }> {
  // always resolve with err, standard out, and standard error
  const cb = (res: any) => (err: Error, stdout: string, stderr: string) => {
    res({ err, stdout, stderr });
  };
  return new Promise(res => {
    exec(cmd, options, cb(res));
  });
}
