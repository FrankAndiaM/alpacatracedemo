import React from 'react';
import ReactDOM from 'react-dom';

import 'react-image-lightbox/style.css';
import 'simplebar/src/simplebar.css';
// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';

import App from '~ui/App/App';
// import * as serviceWorker from '~utils/serviceWorker';
// import 'simplebar/dist/simplebar.min.css';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
