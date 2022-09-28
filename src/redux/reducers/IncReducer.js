import { SET_CURRENT_INC, SET_EDIT_INC, SET_INC } from "../actions";


const initialState = {
  inc: [],
  current: {},
  editInc: false
};

const IncReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_INC:
      return {
        ...state,
        current: payload,
      };
    case SET_INC:
      return {
        ...state,
        inc: payload,
      };
      case SET_EDIT_INC:
        return {
          ...state,
          editInc: payload,
        };

    default:
      return state;
  }
};

export default IncReducer;