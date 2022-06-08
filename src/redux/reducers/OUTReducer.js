import { SET_CURRENT_OUT, SET_EDIT_OUT, SET_OUT } from "../actions";


const initialState = {
  out: [],
  current: {},
  editOut: false
};

const OUTReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_OUT:
      return {
        ...state,
        current: payload,
      };
    case SET_OUT:
      return {
        ...state,
        out: payload,
      };
      case SET_EDIT_OUT:
        return {
          ...state,
          editOut: payload,
        };

    default:
      return state;
  }
};

export default OUTReducer;