import { SET_CURRENT_FM, SET_EDIT_FM, SET_FM } from "../actions";


const initialState = {
  forml: [],
  current: {},
  editForml: false
};

const FMReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_FM:
      return {
        ...state,
        current: payload,
      };
    case SET_FM:
      return {
        ...state,
        forml: payload,
      };
      case SET_EDIT_FM:
        return {
          ...state,
          editForml: payload,
        };

    default:
      return state;
  }
};

export default FMReducer;