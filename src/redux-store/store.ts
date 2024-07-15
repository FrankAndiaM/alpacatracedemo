import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { authReducer } from './reducers';
import thunk from 'redux-thunk';
import { useDispatch } from 'react-redux';
const appReducer = combineReducers({
  auth: authReducer
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'SIGN_OUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

// const persistedState = loadState();
// const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
// const store = createStore(rootReducer, compose(applyMiddleware(thunk), composeEnhancers()));

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

// store.subscribe(() => {
//   saveState(store.getState());
// });
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;
