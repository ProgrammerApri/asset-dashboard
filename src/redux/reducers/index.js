import { combineReducers } from "redux";
import DOReducer from "./DOReducer";
import POReducer from "./POReducer";
import RpReducer from "./RpReducer";
import SOReducer from "./SOReducer";


const rootReducer = combineReducers({
  rp: RpReducer,
  po: POReducer,
  so: SOReducer,
  Do: DOReducer,
});

export default rootReducer;
