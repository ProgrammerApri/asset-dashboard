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
import ICReducer from "./ICReducer";
import LMReducer from "./LMReducer";
import PBReducer from "./PBReducer";
import PHJReducer from "./PHJReducer";
import PBBReducer from "./PBBReducer";
import FMReducer from "./FMReducer";
import MSNReducer from "./MSNReducer";
import PLReducer from "./PLReducer";
import BTCReducer from "./BTCReducer";
import MemorialReducer from "./MemorialReducer";
import IncReducer from "./IncReducer";
import GIROINReducer from "./GiroIncReducer";
import ProfileReducer from "./ProfileReducer";
import UserReducer from "./UserReducer";
import SaldoAwalReducer from "./SaldoAwalReducer";
import BudgetingReducer from "./BudgetingReducer";
import PnlReducer from "./PnlReducer";
import RpAutoReducer from "./RpAutoReducer";
import RecActReducer from "./RecActReducer";
import WorkCenterReducer from "./WorkCenterReducer";
import JENISKERJAReducer from "./JENISKERJAReducer";
import RAKReducer from "./RAKReducer";
// import PBNReducer from "./PBNReducer";


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
  ic: ICReducer,
  lm: LMReducer,
  pb: PBReducer,
  phj: PHJReducer,
  pbb: PBBReducer,
  forml: FMReducer,
  msn: MSNReducer,
  plan: PLReducer,
  btc: BTCReducer,
  memorial: MemorialReducer,
  inc: IncReducer,
  giro_in: GIROINReducer,
  profile: ProfileReducer,
  user: UserReducer,
  fk_pj: INVReducer,
  inv_pj: INVReducer,
  fk_pb: INVReducer,
  sa: SaldoAwalReducer,
  bu: BudgetingReducer,
  pnl: PnlReducer,
  rpauto: RpAutoReducer,
  recAct: RecActReducer,
  wc: WorkCenterReducer,
  jns_kerja: JENISKERJAReducer,
  rak: RAKReducer,
});

export default rootReducer;
