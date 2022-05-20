import { createStore, compose, applyMiddleware } from "redux";
import rootReducers from "./reducers";
import ReduxThunk from "redux-thunk";
import logger from "redux-logger";

let middleware = [ReduxThunk];
if (process.env.REACT_APP_ENVIRONTMENT !== "production") {
  middleware = [...middleware, logger];
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const appMiddleware = applyMiddleware(...middleware);
const store = createStore(rootReducers, composeEnhancers(appMiddleware));

export default store;
