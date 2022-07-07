import { SET_CURRENT_IC, SET_EDIT_IC, SET_IC } from "../actions";


const initialState = {
  ic: [],
  current: {},
  editIc: false
};

const ICReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_IC:
      return {
        ...state,
        current: payload,
      };
    case SET_IC:
      return {
        ...state,
        ic: payload,
      };
      case SET_EDIT_IC:
        return {
          ...state,
          editIc: payload,
        };

    default:
      return state;
  }
};

export default ICReducer;