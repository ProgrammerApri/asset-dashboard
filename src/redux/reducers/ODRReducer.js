import { SET_CURRENT_ODR, SET_EDIT_ODR, SET_ODR } from "../actions";


const initialState = {
  order: [],
  current: {},
  editOdr: false
};

const ODRReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_ODR:
      return {
        ...state,
        current: payload,
      };
    case SET_ODR:
      return {
        ...state,
        order: payload,
      };
      case SET_EDIT_ODR:
        return {
          ...state,
          editOdr: payload,
        };

    default:
      return state;
  }
};

export default ODRReducer;