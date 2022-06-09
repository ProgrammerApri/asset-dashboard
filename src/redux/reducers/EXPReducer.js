import { SET_CURRENT_EXP, SET_EDIT_EXP, SET_EXP } from "../actions";


const initialState = {
  exp: [],
  current: {},
  editExp: false
};

const EXPReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_EXP:
      return {
        ...state,
        current: payload,
      };
    case SET_EXP:
      return {
        ...state,
        exp: payload,
      };
      case SET_EDIT_EXP:
        return {
          ...state,
          editExp: payload,
        };

    default:
      return state;
  }
};

export default EXPReducer;