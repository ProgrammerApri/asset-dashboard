import { SET_CURRENT_SL, SET_SL, SET_EDIT_SL } from "../actions";

const initialState = {
  sl: [],
  current: {},
  editSL: false
};

const SLReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_SL:
      return {
        ...state,
        current: payload,
      };
    case SET_SL:
      return {
        ...state,
        sl: payload,
      };
      case SET_EDIT_SL:
        return {
          ...state,
          editSL: payload,
        };

    default:
      return state;
  }
};

export default SLReducer;