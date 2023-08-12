import {  SET_CURRENT_WC, SET_EDIT_WC, SET_WC } from "../actions";


const initialState = {
  wc: [],
  current: {},
  editWc: false
};

const WorkCenterReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_WC:
      return {
        ...state,
        current: payload,
      };
    case SET_WC:
      return {
        ...state,
        wc: payload,
      };
      case SET_EDIT_WC:
        return {
          ...state,
          editWc: payload,
        };

    default:
      return state;
  }
};

export default WorkCenterReducer;