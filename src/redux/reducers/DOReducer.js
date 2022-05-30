import { SET_CURRENT_DO, SET_DO, SET_EDIT_DO } from "../actions";


const initialState = {
  Do: [],
  current: {},
  editdDo: false
};

const DOReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_DO:
      return {
        ...state,
        current: payload,
      };
    case SET_DO:
      return {
        ...state,
        Do: payload,
      };
      case SET_EDIT_DO:
        return {
          ...state,
          editDo: payload,
        };

    default:
      return state;
  }
};

export default DOReducer;