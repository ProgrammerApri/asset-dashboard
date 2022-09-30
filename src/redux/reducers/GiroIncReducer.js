import { SET_CURRENT_GIROIN, SET_EDIT_GIROIN, SET_GIROIN } from "../actions";


const initialState = {
  giro_in: [],
  current: {},
  editGiroIn: false
};

const GIROINReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_GIROIN:
      return {
        ...state,
        current: payload,
      };
    case SET_GIROIN:
      return {
        ...state,
        giro_in: payload,
      };
      case SET_EDIT_GIROIN:
        return {
          ...state,
          editGiroIn: payload,
        };

    default:
      return state;
  }
};

export default GIROINReducer;