import { createElement } from 'react';
import { cssRaw, media, style } from 'typestyle';
import { HEADER_HEIGHT } from '../layout/Header';

const loadingContainerClass = style({
  position: 'absolute',
  top: 0,
  width: '100%',
  zIndex: 10,
  backgroundColor: 'white',
  marginTop: HEADER_HEIGHT
});

const embededLoadingClass = style({
  width: '100vw',
  height: '100vh',
  marginTop: 0
});

const nonEmbedClass = style(
  {
    height: 475
  },
  media(
    { maxWidth: 768 },
    {
      height: 300
    }
  )
);

const Loader: React.StatelessComponent<{}> = () => <div className="loader" />;

const LoadingIndicator: React.StatelessComponent<{
  loaded: boolean;
  embed: boolean;
}> = ({ loaded, embed }) =>
  loaded
    ? null
    : <div
        className={
          loadingContainerClass +
          ' ' +
          (embed ? embededLoadingClass : nonEmbedClass)
        }
      >
        <Loader />
      </div>;

export default LoadingIndicator;

cssRaw(`
.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 150px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(220,220,220, 0.2);
  border-right: 1.1em solid rgba(220,220,220, 0.2);
  border-bottom: 1.1em solid rgba(220,220,220, 0.2);
  border-left: 1.1em solid #dcdcdc;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
`);
