import { createElement } from 'react';
import { connect } from 'react-redux';
import { style } from 'typestyle';
import { stateData } from '../../data';
import {
  ChartToolTipData,
  State,
  StateToolTipData,
  ToolTipData,
  TooltipState,
  TractToolTipData
} from '../../store';
import { percent } from '../charts/format';
import { Colors } from '../colors';
import { HEADER_HEIGHT } from '../layout/Header';

const toolTipClass = style({
  position: 'fixed',
  display: 'block',
  backgroundColor: Colors.INFO_BACKGROUND,
  padding: 15,
  border: '1px solid #ccc',
  zIndex: 10,
  fontFamily: 'Open Sans',
  fontSize: 14,
  pointerEvents: 'none'
});

type ToolTipProps = Readonly<{
  state: TooltipState;
  embed: boolean;
  x: number;
  y: number;
}>;

function getToolTipPosition({ state, x, y, embed }: ToolTipProps) {
  // tract is fixed in corner
  if (state.show === true && state.data.kind === 'tract')
    return { right: 40, top: (embed ? 0 : HEADER_HEIGHT) + 30 };

  // otherwise render above mouse
  return { left: x, top: y - 10, transform: 'translate(-50%, -100%)' };
}

export const ToolTip = (props: ToolTipProps) =>
  !props.state.show
    ? <div style={{ display: 'none' }} />
    : <div className={toolTipClass} style={getToolTipPosition(props)}>
        {getTooltipContent(props.state.data)}
      </div>;

export default connect((state: State) => {
  return {
    ...state.mouse,
    state: state.tooltip,
    embed: state.embed
  };
})(ToolTip);

const StateTooltip = ({ properties }: StateToolTipData) => {
  const state = properties.state;
  const data = stateData[state];

  return (
    <div>
      <div>
        <b>{percent(data.percentInDesertsAll)}</b> of people in {state} live in
        a childcare desert.
      </div>
      <div style={{ fontStyle: 'italic', marginTop: 5, opacity: 0.8 }}>
        Click for detail
      </div>
    </div>
  );
};

const tractRowClass = style({
  marginTop: 10
});

const titleStyle: React.CSSProperties = { fontWeight: 'bold' };
const italic: React.CSSProperties = { fontStyle: 'italic' };

const TractTooltip = ({ properties }: TractToolTipData) =>
  <div>
    <span style={titleStyle}>
      Census Tract {Number(properties.GEOID)}
      {properties.ccdesert
        ? <div style={italic}>Child Care Desert </div>
        : <div> &nbsp; </div>}
    </span>
    <div className={tractRowClass}>
      Licensed child care providers: {properties.noproviders} <br />
      Total child care capacity: XX
    </div>
    <div className={tractRowClass}>
      Population (total): XXX <br />
      Population (under 5): XXX
    </div>
    <div className={tractRowClass}>
      Median family income: $XX,XXX <br />
      Maternal labor force participation: XX%
    </div>
    <div className={tractRowClass}>
      Percent White: {percent(properties.per_white)} <br />
      Percent Black: {percent(properties.per_black)} <br />
      Percent Hispanic: {percent(properties.per_latino)}
    </div>
  </div>;

const ChartTooltip = ({ properties }: ChartToolTipData) =>
  <div>
    {properties.label}: <b>{properties.value}</b>
  </div>;

function getTooltipContent(data: ToolTipData): JSX.Element {
  switch (data.kind) {
    case 'state':
      return <StateTooltip {...data} />;
    case 'tract':
      return <TractTooltip {...data} />;
    case 'chart':
      return <ChartTooltip {...data} />;
  }
}
