import { SET_CURRENT_GIRO, SET_EDIT_GIRO, SET_GIRO } from "../actions";


const initialState = {
  giro: [],
  current: {},
  editGiro: false
};

const GIROReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_GIRO:
      return {
        ...state,
        current: payload,
      };
    case SET_GIRO:
      return {
        ...state,
        giro: payload,
      };
      case SET_EDIT_GIRO:
        return {
          ...state,
          editGiro: payload,
        };

    default:
      return state;
  }
};

export default GIROReducer;