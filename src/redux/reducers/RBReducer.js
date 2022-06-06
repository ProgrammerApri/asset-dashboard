import { SET_CURRENT_RB, SET_RB, SET_EDIT_RB } from "../actions";


const initialState = {
  rb: [],
  current: {},
  editdRb: false
};

const RBReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_RB:
      return {
        ...state,
        current: payload,
      };
    case SET_RB:
      return {
        ...state,
        rb: payload,
      };
      case SET_EDIT_RB:
        return {
          ...state,
          editdRb: payload,
        };

    default:
      return state;
  }
};

export default RBReducer;