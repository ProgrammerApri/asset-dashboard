import { SET_CURRENT_KP, SET_EDIT_KP, SET_KP } from "../actions";


const initialState = {
  kp: [],
  current: {},
  editKp: false
};

const KPReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_KP:
      return {
        ...state,
        current: payload,
      };
    case SET_KP:
      return {
        ...state,
        kp: payload,
      };
      case SET_EDIT_KP:
        return {
          ...state,
          editKp: payload,
        };

    default:
      return state;
  }
};

export default KPReducer;