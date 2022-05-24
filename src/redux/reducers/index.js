import { combineReducers } from "redux";
import POReducer from "./POReducer";
import RpReducer from "./RpReducer";
import SOReducer from "./SOReducer";


const rootReducer = combineReducers({
  rp: RpReducer,
  po: POReducer,
  so: SOReducer,
});

export default rootReducer;
