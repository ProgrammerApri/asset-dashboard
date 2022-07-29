import { SET_CURRENT_PL, SET_EDIT_PL, SET_PL } from "../actions";


const initialState = {
  plan: [],
  current: {},
  editPlan: false
};

const PLReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_PL:
      return {
        ...state,
        current: payload,
      };
    case SET_PL:
      return {
        ...state,
        plan: payload,
      };
      case SET_EDIT_PL:
        return {
          ...state,
          editPlan: payload,
        };

    default:
      return state;
  }
};

export default PLReducer;