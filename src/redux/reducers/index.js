import { combineReducers } from "redux";
import POReducer from "./POReducer";
import RpReducer from "./RpReducer";


const rootReducer = combineReducers({
  rp: RpReducer,
  po: POReducer,
});

export default rootReducer;
