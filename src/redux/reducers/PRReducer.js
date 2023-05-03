import { SET_CURRENT_PR, SET_PR, SET_EDIT_PR } from "../actions";


const initialState = {
  pr: [],
  current: {},
  editPr: false
};

const PRReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_PR:
      return {
        ...state,
        current: payload,
      };
    case SET_PR:
      return {
        ...state,
        pr: payload,
      };
      case SET_EDIT_PR:
        return {
          ...state,
          editPr: payload,
        };

    default:
      return state;
  }
};

export default PRReducer;