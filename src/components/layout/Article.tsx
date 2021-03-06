import { content, flex } from 'csstips';
import { Component, createElement } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { media, style } from 'typestyle';
import * as zenscroll from 'zenscroll';

import { StateName } from '../../data';
import { Dispatch, focusArticleComplete, State } from '../../store/';
import { StateBarChart } from '../charts/';
import { Colors } from '../colors';
import { HEADER_HEIGHT } from './Header';
import { Info } from './Icons';
import { VISUALS_SUPPORTED } from './SupportMessage';
import Title from './Title';

const ARTICLE_MAX_WIDTH = 750;

const articleClass = style(content, {
  textAlign: 'left',
  maxWidth: ARTICLE_MAX_WIDTH,
  margin: '0 auto',
  lineHeight: '2em',
  $nest: {
    '& p': {
      lineHeight: '24px',
      fontSize: '14px'
    }
  }
});

const anchorClass = style(
  {
    width: '100%',
    display: 'block',
    textAlign: 'center',
    fontSize: '14px',
    color: Colors.HEADER_GRAY
  },
  media(
    { minWidth: 789 },
    {
      display: 'none'
    }
  )
);

const articleContainerClass = style(
  flex,
  {
    padding: 60,
    paddingTop: 0
  },
  media(
    { maxWidth: 768 },
    {
      padding: 30
    }
  )
);

const stateBarChartClass = style(content, {
  maxWidth: 600,
  margin: '0 auto',
  textAlign: 'center'
});

const ruleClass = style({
  width: '100%',
  maxWidth: ARTICLE_MAX_WIDTH,
  padding: 0,
  margin: '0 auto',
  marginBottom: 40
});

const paragraphClass = style({
  marginTop: 0
});

type ArticleProps = Readonly<{
  selectedState: StateName;
  active: boolean;
  deactivate(): void;
}>;

class Article extends Component<ArticleProps> {
  public componentDidMount() {
    const defaultDuration = 500;
    const edgeOffset = HEADER_HEIGHT;
    zenscroll.setup(defaultDuration, edgeOffset);
  }

  public componentDidUpdate() {
    this.ensureVisible();
  }

  /**
   * if a scroll event has been dispatched,
   * scroll the window to this element.
   */
  public ensureVisible() {
    const { active, deactivate } = this.props;
    if (active) {
      const node = findDOMNode(this);
      zenscroll.to(node);
      deactivate();
    }
  }

  public render() {
    const { selectedState } = this.props;
    return (
      <div className={articleContainerClass}>
        <hr className={ruleClass} />
        {VISUALS_SUPPORTED
          ? <div className={stateBarChartClass}>
              <StateBarChart selectedState={selectedState} />
            </div>
          : null}
        <div className={articleClass}>
          <Title>
            {' '}Child Care Access in {selectedState}{' '}
          </Title>
          <p className={paragraphClass}>
            {' '}Derat. Bea quodi blanimi nullabo. Bus estecte molorro qui sin
            reris etur? Re am consed que dolut lam erum quate velenisti dolora
            nimporiti o ctiis et ipid quis nissinciae cum verem dit, nobitatecto
            o cid ullaut occab ipsaper spe- rum nobitatemqui dolestisi desequam
            aut es eostiae caboreritas minvers perenient eturepuda ipisimus ut
            lab il et eaqui oUllector esequi rem aliquae nis dolorist volupta
            ectiunt quo mi, consectio blaceste aliquos eaque et, o c to- tatus
            citibus sandisini autem fuga. Ur, voluptatur accuptusdant occuptur
            rem etustis. Re am consed que dolut lam erum quate velenisti dolora
            nimporiti o ctiis et ipid quis nissinciae cum verem dit, nobitatecto
            o cid ullaut occab ipsaper sperum nobitatemqui dolestisi desequam
            aut es eostiae caboreritas minvers perenient eturepuda ipisimus ut
            lab il et eaqui oUllector esequi rem aliquae nis dolorist volupta
            ectiunt quo mi, consectio blaceste aliquos eaque et, o c totatus
            citibus sandisini autem fuga. Ur, voluptatur accuptusdant occuptur
            rem etustis.{' '}
          </p>

          <Title> About the Study </Title>
          <p className={paragraphClass}>
            Derat. Bea quodi blanimi nullabo. Bus estecte molorro qui sin reris
            etur? Re am consed que dolut lam erum quate velenisti dolora
            nimporiti o ctiis et ipid quis nissinciae cum verem dit, nobitatecto
            o cid ullaut occab ipsaper sperum nobitatemqui dolestisi desequam
            aut es eostiae caboreritas min- vers perenient eturepuda ipisimus ut
            lab il et eaqui oUllector esequi rem aliquae nis dolorist volupta
            ectiunt quo mi, consectio blaceste aliquos eaque et, o c totatus
            citibus sandisini autem fuga. Ur, voluptatur accuptusdant occuptur
            rem etustis.
          </p>
          <p>
            Hendam et pel im quodi idignamet que nobis velent lam, volupta num
            exero optae corrumq uiatu- scieni rem nis re in ped qui beatibea
            quam, niae exererum velectur? Qui vollor aut volore occabore rem
            quibeatecat disquat quiantis et lab iment ut in rerferferis ex et
            idel ilignam evelestibus si qui cus sim enit, conseque moloreprati
            autatem.
          </p>
          <p>
            Et vel minctota dem harum que nam iur mi, exeriam sed magnim et mi,
            quiam si optaturiate volup- tassi blandis se volut assequis recabor
            eperspel ma quod ut lab ius as qui reribus, eatem que vent et
            alicius dia voluptur acestium hilignatio. Nemodis exceaquae res id
            quideli tionecum rempor aut inve- leseque nonseque volupta sed
            expedis deniento conet, sunt et faccatur si occati nimpore henihit
            pra anda volum eum sum ipis erectiat laniatem rentet fugiatiam dio
            veniend eliberia
          </p>
          <a className={anchorClass} href="#" target="_blank">
            download the report <Info />
          </a>
        </div>
      </div>
    );
  }
}

export default connect(
  (state: State) => {
    return {
      selectedState: state.selectedState,
      active: state.articleFocus
    };
  },
  (dispatch: Dispatch) => {
    return {
      deactivate() {
        dispatch(focusArticleComplete());
      }
    };
  }
)(Article);
