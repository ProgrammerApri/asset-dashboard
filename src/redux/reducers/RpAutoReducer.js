import {
 
  SET_EDIT_AUTO,
  SET_CURRENT_AUTO,
  SET_AUTO,
} from "../actions";

const initialState = {
 

  rpauto: [],
  currentauto: {},
  editRpAuto: false,
};

const RpAutoReducer = (state = initialState, { type, payload }) => {
  switch (type) {
      //
    case SET_CURRENT_AUTO:
      return {
        ...state,
        currentauto: payload,
      };
    case SET_AUTO:
      return {
        ...state,
        rpauto: payload,
      };
    case SET_EDIT_AUTO:
      return {
        ...state,
        editRpAuto: payload,
      };

    default:
      return state;
  }
};

export default RpAutoReducer;
