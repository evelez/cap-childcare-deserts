import { createElement } from 'react';
import { Colors } from '../colors';
import { style } from 'typestyle';

const entries = [
  { color: Colors.ORANGE, text: 'Child care desert', circle: false },
  { color: Colors.GRAY, text: 'Not a child care desert', circle: false },
  { color: Colors.BLUE, text: 'Child care center', circle: true },
  { color: Colors.LIGHT_BLUE, text: 'Family child care provider', circle: true }
];

const legendClass = style({
  width: '100%',
  textAlign: 'center',
  backgroundColor: 'rgba(255,255,255,0.7)',
  padding: 5,
  zIndex: 10,
  position: 'absolute',
  bottom: 0
});

const entryClass = style({
  margin: 10
});

const entryBlockClass = style({
  display: 'inline-block',
  width: 15,
  height: 15,
  marginBottom: -3
});

const entryCircleClass = style({
  display: 'inline-block',
  width: 10,
  height: 10,
  borderRadius: '50%'
});

const entryTextClass = style({
  marginLeft: 5
});

const TractLegend = () =>
  <div className={legendClass}>
    {entries.map(entry =>
      <span className={entryClass}>
        <span
          className={entry.circle ? entryCircleClass : entryBlockClass}
          style={{ backgroundColor: entry.color }}
        />
        <span className={entryTextClass}>
          {entry.text}
        </span>
      </span>
    )}
  </div>;

export default TractLegend;
