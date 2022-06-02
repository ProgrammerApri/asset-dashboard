import { combineReducers } from "redux";
import INVReducer from "./INVReducer";
import POReducer from "./POReducer";
import PRReducer from "./PRReducer";
import RpReducer from "./RpReducer";
import SOReducer from "./SOReducer";
import SRReducer from "./SRReducer";
import ODRReducer from "./ODRReducer";


const rootReducer = combineReducers({
  rp: RpReducer,
  po: POReducer,
  so: SOReducer,
  order: ODRReducer,
  pr: PRReducer,
  sr: SRReducer,
  inv: INVReducer,
});

export default rootReducer;
