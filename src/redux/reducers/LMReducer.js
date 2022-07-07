import { SET_CURRENT_LM, SET_EDIT_LM, SET_LM } from "../actions";


const initialState = {
  lm: [],
  current: {},
  editLm: false
};

const LMReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_LM:
      return {
        ...state,
        current: payload,
      };
    case SET_LM:
      return {
        ...state,
        lm: payload,
      };
      case SET_EDIT_LM:
        return {
          ...state,
          editLm: payload,
        };

    default:
      return state;
  }
};

export default LMReducer;