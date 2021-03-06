declare const __ACCESS_TOKEN__: string;
export const accessToken = __ACCESS_TOKEN__;
export const mapboxStyle = 'mapbox://styles/bsouthga/cj62watyt3u9b2rs751ceye4p';
export const stateModeLayers = [
  // 'all-states-json-hover',
  'allstates-stroke',
  'allstates',
  'square'
];

export enum HoverSources {
  STATE = 'hover-states',
  TRACT = 'hover-tracts'
}
