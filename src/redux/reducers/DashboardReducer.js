import { SET_DASHBOARD_DATA } from "../actions";

const initialState = {
  dashboard: {},
};

const DashboardReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DASHBOARD_DATA:
      return {
        ...state,
        dashboard: payload,
      };
    default:
      return state;
  }
};

export default DashboardReducer;
