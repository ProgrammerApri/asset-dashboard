import { combineReducers } from "redux";
import RpReducer from "./RpReducer";


const rootReducer = combineReducers({
  rp: RpReducer,
});

export default rootReducer;
