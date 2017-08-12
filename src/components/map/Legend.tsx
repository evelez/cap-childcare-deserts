import { createElement } from 'react';
import { style } from 'typestyle';
import { Colors } from '../colors';
import { TRACT_CONTROL_INDENT } from './constants';

const bins = [
  ['60%+', '#932506'],
  ['50-60%', '#D93E0E'],
  ['40-50%', '#FA833D'],
  ['30-40%', '#FDAF6D'],
  ['-30%', '#FCD0B3']
];

const legendClass = style({
  backgroundColor: Colors.INFO_BACKGROUND,
  width: 150,
  padding: 15,
  borderRadius: 5,
  lineHeight: '1em',
  display: 'block',
  position: 'absolute',
  bottom: 100,
  right: TRACT_CONTROL_INDENT,
  zIndex: 3
});

const legendItemClass = style({
  position: 'relative',
  height: 20
});

const legendSquareClass = style({
  width: 20,
  height: 20,
  display: 'inline-block'
});

const legendBinClass = style({
  marginLeft: 10,
  position: 'relative',
  top: '50%',
  transform: 'translateY(-130%)',
  display: 'inline-block'
});

const legendTitleClass = style({
  fontWeight: 'bold',
  fontSize: 14,
  marginBottom: 10
});

type LegendProps = {};

type LegendEntryProps = {
  color: string;
  range: string;
  style?: React.CSSProperties;
};

const LegendEntry = ({ color, range, style }: LegendEntryProps) =>
  <div className={legendItemClass} style={style}>
    <span
      className={legendSquareClass}
      style={{
        backgroundColor: color
      }}
    />
    <span className={legendBinClass}>
      {range}{' '}
    </span>
  </div>;

const Legend = (props: LegendProps) =>
  <div className={legendClass}>
    <div className={legendTitleClass}>
      Percent living in a child care desert{' '}
    </div>
    {bins.map(([range, color]) => <LegendEntry range={range} color={color} />)}
    <LegendEntry
      range={'(no data)'}
      color={Colors.GRAY}
      style={{
        marginTop: 10
      }}
    />
  </div>;

export default Legend;
