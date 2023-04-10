import { SET_CURRENT_PNL, SET_PNL_DATE, SET_SETUP_PNL } from "../actions";

const initialState = {
  filter_date: null,
  setup: null,
  current: null,
  default: {
    id: null,
    name: null,
    type: 1,
    for_balance: false,
    klasifikasi: null,
    rule: null,
  },
};

const PnlReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_PNL_DATE:
      return {
        ...state,
        filter_date: payload,
      };
    case SET_SETUP_PNL:
      return {
        ...state,
        setup: payload,
      };
    case SET_CURRENT_PNL:
      return {
        ...state,
        current: payload,
      };
    default:
      return state;
  }
};

export default PnlReducer;
