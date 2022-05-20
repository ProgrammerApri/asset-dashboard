import { SET_CURRENT_RP, SET_RP, RESET_CURRENT_RP, UPDATE_CURRENT_RP } from "../actions";

const initialState = {
  rp: [],
  current: {},
};

const RpReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_RP:
      return {
        ...state,
        current: payload,
      };
    case SET_RP:
      return {
        ...state,
        rp: payload,
      };

    default:
      return state;
  }
};

export default RpReducer;
