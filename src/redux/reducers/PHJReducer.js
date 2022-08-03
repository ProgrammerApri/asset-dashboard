import { SET_CURRENT_PHJ, SET_PHJ, SET_EDIT_PHJ } from "../actions";


const initialState = {
  phj: [],
  current: {},
  editPhj: false
};

const PHJReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_PHJ:
      return {
        ...state,
        current: payload,
      };
    case SET_PHJ:
      return {
        ...state,
        phj: payload,
      };
      case SET_EDIT_PHJ:
        return {
          ...state,
          editPhj: payload,
        };

    default:
      return state;
  }
};

export default PHJReducer;