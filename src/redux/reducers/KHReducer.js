import { SET_CURRENT_KH, SET_EDIT_KH, SET_KH } from "../actions";


const initialState = {
  kh: [],
  current: {},
  editKh: false
};

const KHReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_KH:
      return {
        ...state,
        current: payload,
      };
    case SET_KH:
      return {
        ...state,
        kh: payload,
      };
      case SET_EDIT_KH:
        return {
          ...state,
          editKh: payload,
        };

    default:
      return state;
  }
};

export default KHReducer;