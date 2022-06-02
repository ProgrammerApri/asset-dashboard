import { combineReducers } from "redux";
import DOReducer from "./DOReducer";
import INVReducer from "./INVReducer";
import POReducer from "./POReducer";
import ProductReducer from "./ProductReducer";
import PRReducer from "./PRReducer";
import RpReducer from "./RpReducer";
import SOReducer from "./SOReducer";
import SRReducer from "./SRReducer";


const rootReducer = combineReducers({
  rp: RpReducer,
  po: POReducer,
  so: SOReducer,
  Do: DOReducer,
  product: ProductReducer,
  pr: PRReducer,
  sr: SRReducer,
  inv: INVReducer,
});

export default rootReducer;
