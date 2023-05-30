import { SET_CURRENT_RP, SET_RP, RESET_CURRENT_RP, UPDATE_CURRENT_RP, SET_EDIT, SET_CURRENT_RP_AUTO, SET_RP_AUTO, SET_EDIT_AUTO } from "../actions";

const initialState = {
  rp: [],
  current: {},
  editRp: false,
  
  rp_auto: [],
  currentauto: {},
  editRp: false
};

const RpReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_RP:
      return {
        ...state,
        current: payload,
      };
    case SET_RP:
      return {
        ...state,
        rp: payload,
      };
      case SET_EDIT:
        return {
          ...state,
          editRp: payload,
        };
    case SET_CURRENT_RP_AUTO:
      return {
        ...state,
        currentauto: payload,
      };
    case SET_RP_AUTO:
      return {
        ...state,
        rp_auto: payload,
      };
      case SET_EDIT_AUTO:
        return {
          ...state,
          editRp: payload,
        };

    default:
      return state;
  }
};

export default RpReducer;
