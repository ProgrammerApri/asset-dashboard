import { SET_CURRENT_SO, SET_SO, SET_EDIT } from "../actions";

const initialState = {
  so: [],
  current: {},
  editso: false
};

const SOReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_SO:
      return {
        ...state,
        current: payload,
      };
    case SET_SO:
      return {
        ...state,
        so: payload,
      };
      case SET_EDIT:
        return {
          ...state,
          editso: payload,
        };

    default:
      return state;
  }
};

export default SOReducer;