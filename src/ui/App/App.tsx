import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import store from '~redux-store/store';
import { SnackbarProvider } from 'notistack';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from '~ui/components/ScrollToTop';
// import ConfirmNavigation from '~ui/molecules/ConfimNavigation/ConfirmNavigation';

const App: React.FC<any> = () => {
  // const [confirm, setConfirm] = useState(false);
  // const [confirmCallback, setConfirmCallback] = useState(null);
  // const [titleConfirm, setTitleConfirm] = useState('');
  // const getConfirmation = (message: any, callback: any) => {
  //   setConfirmCallback(() => callback);
  //   setTitleConfirm(message);
  //   setConfirm(true);
  // };

  return (
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter
          basename="/"
          // getUserConfirmation={getConfirmation}
        >
          <SnackbarProvider>
            <ScrollToTop />
            <Router />
          </SnackbarProvider>
          {/* {confirm && (
            <ConfirmNavigation title={titleConfirm} confirmCallback={confirmCallback} setConfirm={setConfirm} />
          )} */}
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  );
};

export default React.memo(App);
