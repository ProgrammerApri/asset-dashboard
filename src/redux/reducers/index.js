import { combineReducers } from "redux";
import INVReducer from "./INVReducer";
import POReducer from "./POReducer";
import ProductReducer from "./ProductReducer";
import PRReducer from "./PRReducer";
import RpReducer from "./RpReducer";
import SOReducer from "./SOReducer";
import SRReducer from "./SRReducer";
import ODRReducer from "./ODRReducer";
import RBReducer from "./RBReducer";
import SLReducer from "./SLReducer";
import EXPReducer from "./EXPReducer";
import GIROReducer from "./GIROReducer";
import DashboardReducer from "./DashboardReducer";
import KHReducer from "./KHReducer";
import KPReducer from "./KPReducer";


const rootReducer = combineReducers({
  rp: RpReducer,
  po: POReducer,
  so: SOReducer,
  order: ODRReducer,
  product: ProductReducer,
  pr: PRReducer,
  sr: SRReducer,
  inv: INVReducer,
  rb: RBReducer,
  sl: SLReducer,
  exp: EXPReducer,
  giro: GIROReducer,
  dash: DashboardReducer,
  kh: KHReducer,
  kp: KPReducer,
});

export default rootReducer;
