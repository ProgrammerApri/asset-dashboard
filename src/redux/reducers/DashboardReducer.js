import { SET_DASHBOARD_DATA, SET_SALDO_STATUS } from "../actions";

const initialState = {
  dashboard: {},
  isBalance: false,
};

const DashboardReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DASHBOARD_DATA:
      return {
        ...state,
        dashboard: payload,
      };

      case SET_SALDO_STATUS:
      return {
        ...state,
        isBalance: payload,
      }
    default:
      return state;
  }
};

export default DashboardReducer;
