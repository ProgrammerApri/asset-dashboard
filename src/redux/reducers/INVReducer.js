import { SET_CURRENT_INV, SET_EDIT_INV, SET_INV } from "../actions";


const initialState = {
  inv: [],
  current: {},
  editInv: false
};

const INVReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_INV:
      return {
        ...state,
        current: payload,
      };
    case SET_INV:
      return {
        ...state,
        inv: payload,
      };
      case SET_EDIT_INV:
        return {
          ...state,
          editInv: payload,
        };

    default:
      return state;
  }
};

export default INVReducer;